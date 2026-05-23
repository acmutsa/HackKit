import { and, asc, desc, eq, sql } from "drizzle-orm";
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

export type DrizzleLibsqlDatabase = ReturnType<typeof drizzle>;

type DrizzleTable = ReturnType<typeof sqliteTable>;
type DrizzleTableMap = Record<ModelKey, DrizzleTable>;

export function toDrizzleTableName(modelKey: ModelKey): string {
	return modelKey.replaceAll(".", "_");
}

function toTableName(modelKey: ModelKey): string {
	return toDrizzleTableName(modelKey);
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

type DrizzleDatabaseAdapterContext = DatabaseAdapterFactoryContext & {
	db: DrizzleLibsqlDatabase;
};

export function createDrizzleDatabaseAdapter(
	db: DrizzleLibsqlDatabase,
): DatabaseAdapterFactory {
	return {
		create(context) {
			return createDrizzleAdapter({ ...context, db });
		},
	};
}

function fieldToSqlType(field: AnyField): string {
	switch (field.kind) {
		case "string":
		case "enum":
			return "TEXT";
		case "integer":
			return "INTEGER";
		case "number":
			return "REAL";
		case "boolean":
			return "INTEGER";
		case "date":
			return "INTEGER";
		case "json":
			return "TEXT";
	}
}

function quoteIdentifier(name: string): string {
	return `"${name.replaceAll('"', '""')}"`;
}

function buildCreateTableStatement(model: PersistentModel): string {
	const columns = Object.entries(model.schema.fields).map(([name, field]) => {
		let column = `${quoteIdentifier(name)} ${fieldToSqlType(field)}`;
		if (field.isPrimaryKey) column += " PRIMARY KEY";
		if (!field.isOptional) column += " NOT NULL";
		if (field.isUnique && !field.isPrimaryKey) column += " UNIQUE";
		return column;
	});

	return `CREATE TABLE IF NOT EXISTS ${quoteIdentifier(toTableName(model.key))} (${columns.join(", ")})`;
}

function formatSqlDefault(field: AnyField): string | null {
	if (!field.defaultValue || field.defaultValue.kind !== "static") {
		return null;
	}

	const value = field.defaultValue.value;

	if (field.kind === "boolean") {
		return value ? "1" : "0";
	}

	if (
		field.kind === "string" ||
		field.kind === "enum" ||
		field.kind === "json"
	) {
		return `'${String(value).replaceAll("'", "''")}'`;
	}

	if (typeof value === "number") {
		return String(value);
	}

	return null;
}

function buildAddColumnStatement(
	tableName: string,
	columnName: string,
	field: AnyField,
): string {
	let column = `${quoteIdentifier(columnName)} ${fieldToSqlType(field)}`;
	const defaultSql = formatSqlDefault(field);

	if (defaultSql !== null) {
		column += ` DEFAULT ${defaultSql}`;
	}

	if (!field.isOptional && defaultSql !== null) {
		column += " NOT NULL";
	}

	return `ALTER TABLE ${quoteIdentifier(tableName)} ADD COLUMN ${column}`;
}

type TableInfoRow = {
	name: string;
};

async function getExistingColumns(
	db: DrizzleLibsqlDatabase,
	tableName: string,
): Promise<Set<string>> {
	const rows = await db.all<TableInfoRow>(
		sql.raw(`PRAGMA table_info(${quoteIdentifier(tableName)})`),
	);
	return new Set(rows.map((row) => row.name));
}

export async function syncDrizzleStorage(
	db: DrizzleLibsqlDatabase,
	storage: StorageRegistry,
): Promise<void> {
	for (const model of Object.values(storage.models)) {
		await db.run(sql.raw(buildCreateTableStatement(model)));

		const tableName = toTableName(model.key);
		const existingColumns = await getExistingColumns(db, tableName);

		for (const [columnName, field] of Object.entries(model.schema.fields)) {
			if (existingColumns.has(columnName)) continue;
			await db.run(
				sql.raw(buildAddColumnStatement(tableName, columnName, field)),
			);
		}
	}
}

function createDrizzleAdapter(
	context: DrizzleDatabaseAdapterContext,
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
}

