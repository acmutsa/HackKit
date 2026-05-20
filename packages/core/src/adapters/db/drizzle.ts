import { and, asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type {
	AnyField,
	DatabaseAdapter,
	DatabaseAdapterFactory,
	DatabaseAdapterFactoryContext,
	InferInsert,
	InferSelect,
	Model,
	ModelKey,
	PersistentModel,
	StorageRegistry,
	Where,
} from "../../database";

type DrizzleTable = ReturnType<typeof sqliteTable>;
type DrizzleTableMap = Record<ModelKey, DrizzleTable>;

function toTableName(modelKey: ModelKey): string {
	return modelKey.replaceAll(".", "_");
}

function toColumn(name: string, field: AnyField) {
	let column: any;

	switch (field.kind) {
		case "string":
		case "enum":
			column = text(name);
			break;
		case "integer":
			column = integer(name);
			break;
		case "number":
			column = real(name);
			break;
		case "boolean":
			column = integer(name, { mode: "boolean" });
			break;
		case "date":
			column = integer(name, { mode: "timestamp" });
			break;
		case "json":
			column = text(name, { mode: "json" });
			break;
	}

	if (field.isPrimaryKey) column = column.primaryKey();
	if (field.isUnique) column = column.unique();
	if (!field.isOptional) column = column.notNull();

	return column;
}

function toTable(model: PersistentModel): DrizzleTable {
	const columns: Record<string, any> = {};

	for (const [name, field] of Object.entries(model.schema.fields)) {
		columns[name] = toColumn(name, field);
	}

	return sqliteTable(toTableName(model.key), columns);
}

function toTables(storage: StorageRegistry): DrizzleTableMap {
	const tables = {} as DrizzleTableMap;

	for (const model of Object.values(storage.models)) {
		tables[model.key] = toTable(model);
	}

	return tables;
}

function applyDefaults<TModel extends Model>(
	model: TModel,
	value: InferInsert<TModel>,
	context: DatabaseAdapterFactoryContext,
): InferSelect<TModel> {
	const row: Record<string, unknown> = { ...value };

	for (const [name, field] of Object.entries(model.schema.fields)) {
		if (row[name] !== undefined) continue;

		const defaultValue = field.defaultValue;
		if (!defaultValue) continue;

		switch (defaultValue.kind) {
			case "static":
				row[name] = defaultValue.value;
				break;
			case "now":
				row[name] = context.now();
				break;
			case "id":
				row[name] = context.id();
				break;
		}
	}

	return row as InferSelect<TModel>;
}

function toWhere(table: DrizzleTable, where: Record<string, unknown>) {
	const clauses = Object.entries(where).map(([key, value]) =>
		eq((table as any)[key], value),
	);

	if (clauses.length === 0) return undefined;
	if (clauses.length === 1) return clauses[0];
	return and(...clauses);
}

export const drizzleDBAdapter: DatabaseAdapterFactory = {
	create(
		context: {
			db: ReturnType<typeof drizzle>;
		} & DatabaseAdapterFactoryContext,
	): DatabaseAdapter {
		const tables = toTables(context.storage);
		const db = context.db as any;

		return {
			async insert(model, value) {
				const table = tables[model.key];
				const row = applyDefaults(model, value, context);
				const [inserted] = await db
					.insert(table)
					.values(row)
					.returning();
				return inserted as InferSelect<typeof model>;
			},

			async findOne(model, where) {
				const [row] = await this.findMany(model, { where, limit: 1 });
				return row ?? null;
			},

			async findMany(model, options) {
				const table = tables[model.key];
				let query = db.select().from(table);
				const where = options?.where
					? toWhere(table, options.where as Record<string, unknown>)
					: undefined;

				if (where) query = query.where(where);
				if (options?.orderBy) {
					const column = (table as any)[
						String(options.orderBy.field)
					];
					query = query.orderBy(
						options.orderBy.direction === "desc"
							? desc(column)
							: asc(column),
					);
				}
				if (options?.limit !== undefined)
					query = query.limit(options.limit);

				return (await query) as InferSelect<typeof model>[];
			},

			async update(model, where, patch) {
				const table = tables[model.key];
				let query = db.update(table).set(patch);
				const condition = toWhere(
					table,
					where as Record<string, unknown>,
				);
				if (condition) query = query.where(condition);
				return (await query.returning()) as InferSelect<typeof model>[];
			},

			async delete(model, where) {
				const table = tables[model.key];
				let query = db.delete(table);
				const condition = toWhere(
					table,
					where as Record<string, unknown>,
				);
				if (condition) query = query.where(condition);
				const deleted = await query.returning();
				return deleted.length;
			},
		};
	},
};
