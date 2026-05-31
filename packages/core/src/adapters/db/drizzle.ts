import { and, asc, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type {
	AnyField,
	DatabaseAdapter,
	DatabaseAdapterFactory,
	DatabaseAdapterFactoryContext,
	DatabaseSchemaAdapter,
	GeneratedSchemaFile,
	InferInsert,
	InferSelect,
	Model,
	ModelKey,
	PersistentModel,
	ReferenceAction,
	StorageRegistry,
	Where,
} from "../../database";

export type DrizzleLibsqlDatabase = ReturnType<typeof drizzle>;

type DrizzleTable = ReturnType<typeof sqliteTable>;
type DrizzleTableMap = Record<ModelKey, DrizzleTable>;
type DrizzleColumnKind = "text" | "integer" | "real";

type CompiledDrizzleColumn = {
	name: string;
	field: AnyField;
	sqlType: string;
	drizzleKind: DrizzleColumnKind;
	drizzleOptions?: string;
	notNull: boolean;
	primaryKey: boolean;
	unique: boolean;
	reference?: {
		tableName: string;
		tableExportName: string;
		field: string;
		onDelete?: ReferenceAction;
		onUpdate?: ReferenceAction;
	};
};

type CompiledDrizzleIndex = {
	name: string;
	columns: readonly string[];
	unique: boolean;
};

type CompiledDrizzleTable = {
	model: PersistentModel;
	tableName: string;
	exportName: string;
	columns: CompiledDrizzleColumn[];
	indexes: CompiledDrizzleIndex[];
};

export type CompiledDrizzleStorage = {
	tables: CompiledDrizzleTable[];
	createTableStatements: string[];
	indexStatements: string[];
	syncStatements: string[];
	schemaSource: string;
};

export function toDrizzleTableName(modelKey: ModelKey): string {
	return modelKey.replaceAll(".", "_");
}

function toTableName(modelKey: ModelKey): string {
	return toDrizzleTableName(modelKey);
}

export function toDrizzleTableExportName(modelKey: ModelKey): string {
	const [namespace = "", ...parts] = modelKey.split(".");
	return [namespace, ...parts]
		.map((part, index) =>
			index === 0
				? part
				: part.charAt(0).toUpperCase() + part.slice(1),
		)
		.join("");
}

function toIdentifier(value: string): string {
	const sanitized = value.replace(/[^a-zA-Z0-9_$]/g, "_");
	if (/^[a-zA-Z_$]/.test(sanitized)) return sanitized;
	return `_${sanitized}`;
}

function toIndexName(tableName: string, columns: readonly string[], unique: boolean): string {
	return `${tableName}_${columns.join("_")}_${unique ? "uniq" : "idx"}`;
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

function fieldToDrizzleColumn(field: AnyField): {
	kind: DrizzleColumnKind;
	options?: string;
} {
	switch (field.kind) {
		case "string":
		case "enum":
			return { kind: "text" };
		case "integer":
			return { kind: "integer" };
		case "number":
			return { kind: "real" };
		case "boolean":
			return { kind: "integer", options: `{ mode: "boolean" }` };
		case "date":
			return { kind: "integer", options: `{ mode: "timestamp" }` };
		case "json":
			return { kind: "text", options: `{ mode: "json" }` };
	}
}

function toSqlReferenceAction(action: ReferenceAction): string {
	switch (action) {
		case "cascade":
			return "CASCADE";
		case "restrict":
			return "RESTRICT";
		case "setNull":
			return "SET NULL";
		case "noAction":
			return "NO ACTION";
	}
}

function toDrizzleReferenceAction(action: ReferenceAction): string {
	switch (action) {
		case "setNull":
			return "set null";
		case "noAction":
			return "no action";
		default:
			return action;
	}
}

function quoteIdentifier(name: string): string {
	return `"${name.replaceAll('"', '""')}"`;
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

function compileDrizzleTable(
	model: PersistentModel,
	storage: StorageRegistry,
): CompiledDrizzleTable {
	const tableName = toTableName(model.key);
	const columns = Object.entries(model.schema.fields).map(([name, field]) => {
		const drizzleColumn = fieldToDrizzleColumn(field);
		const reference = field.reference
			? {
					tableName: toTableName(field.reference.model),
					tableExportName: toDrizzleTableExportName(field.reference.model),
					field: field.reference.field,
					onDelete: field.reference.onDelete,
					onUpdate: field.reference.onUpdate,
				}
			: undefined;
		if (
			field.reference &&
			!Object.values(storage.models).some(
				(storageModel) => storageModel.key === field.reference?.model,
			)
		) {
			throw new Error(
				`Model '${model.key}' references unknown model '${field.reference.model}'.`,
			);
		}
		return {
			name,
			field,
			sqlType: fieldToSqlType(field),
			drizzleKind: drizzleColumn.kind,
			drizzleOptions: drizzleColumn.options,
			notNull: !field.isOptional,
			primaryKey: field.isPrimaryKey === true,
			unique: field.isUnique === true,
			reference,
		} satisfies CompiledDrizzleColumn;
	});

	const indexes: CompiledDrizzleIndex[] = [];
	for (const fields of model.schema.unique ?? []) {
		indexes.push({
			name: toIndexName(tableName, fields, true),
			columns: fields,
			unique: true,
		});
	}
	for (const fields of model.schema.indexes ?? []) {
		indexes.push({
			name: toIndexName(tableName, fields, false),
			columns: fields,
			unique: false,
		});
	}

	return {
		model,
		tableName,
		exportName: toDrizzleTableExportName(model.key),
		columns,
		indexes,
	};
}

function buildCreateTableStatementFromCompiled(table: CompiledDrizzleTable): string {
	const columns = table.columns.map((columnDefinition) => {
		let column = `${quoteIdentifier(columnDefinition.name)} ${columnDefinition.sqlType}`;
		if (columnDefinition.primaryKey) column += " PRIMARY KEY";
		if (columnDefinition.notNull) column += " NOT NULL";
		if (columnDefinition.unique && !columnDefinition.primaryKey) column += " UNIQUE";
		const defaultSql = formatSqlDefault(columnDefinition.field);
		if (defaultSql !== null) column += ` DEFAULT ${defaultSql}`;
		if (columnDefinition.reference) {
			column += ` REFERENCES ${quoteIdentifier(columnDefinition.reference.tableName)}(${quoteIdentifier(columnDefinition.reference.field)})`;
			if (columnDefinition.reference.onDelete) {
				column += ` ON DELETE ${toSqlReferenceAction(columnDefinition.reference.onDelete)}`;
			}
			if (columnDefinition.reference.onUpdate) {
				column += ` ON UPDATE ${toSqlReferenceAction(columnDefinition.reference.onUpdate)}`;
			}
		}
		return column;
	});

	return `CREATE TABLE IF NOT EXISTS ${quoteIdentifier(table.tableName)} (${columns.join(", ")})`;
}

function buildIndexStatement(
	table: CompiledDrizzleTable,
	indexDefinition: CompiledDrizzleIndex,
): string {
	const unique = indexDefinition.unique ? "UNIQUE " : "";
	const columns = indexDefinition.columns.map(quoteIdentifier).join(", ");
	return `CREATE ${unique}INDEX IF NOT EXISTS ${quoteIdentifier(indexDefinition.name)} ON ${quoteIdentifier(table.tableName)} (${columns})`;
}

function buildAddColumnStatement(
	tableName: string,
	columnDefinition: CompiledDrizzleColumn,
): string {
	let column = `${quoteIdentifier(columnDefinition.name)} ${columnDefinition.sqlType}`;
	const defaultSql = formatSqlDefault(columnDefinition.field);

	if (defaultSql !== null) {
		column += ` DEFAULT ${defaultSql}`;
	}

	if (columnDefinition.notNull && defaultSql !== null) {
		column += " NOT NULL";
	}

	return `ALTER TABLE ${quoteIdentifier(tableName)} ADD COLUMN ${column}`;
}

function renderDrizzleColumn(column: CompiledDrizzleColumn): string {
	const args = column.drizzleOptions
		? `"${column.name}", ${column.drizzleOptions}`
		: `"${column.name}"`;
	const parts = [`${column.drizzleKind}(${args})`];
	if (column.primaryKey) parts.push("primaryKey()");
	if (column.notNull) parts.push("notNull()");
	if (column.unique) parts.push("unique()");
	if (column.reference) {
		const options = [
			column.reference.onDelete
				? `onDelete: "${toDrizzleReferenceAction(column.reference.onDelete)}"`
				: null,
			column.reference.onUpdate
				? `onUpdate: "${toDrizzleReferenceAction(column.reference.onUpdate)}"`
				: null,
		].filter(Boolean);
		const optionsText = options.length > 0 ? `, { ${options.join(", ")} }` : "";
		parts.push(
			`references(() => ${column.reference.tableExportName}.${column.reference.field}${optionsText})`,
		);
	}
	return parts.join(".");
}

function renderDrizzleIndexes(table: CompiledDrizzleTable): string {
	if (table.indexes.length === 0) return "";
	const entries = table.indexes.map((indexDefinition) => {
		const factory = indexDefinition.unique ? "uniqueIndex" : "index";
		const columns = indexDefinition.columns
			.map((column) => `table.${column}`)
			.join(", ");
		return `\t${toIdentifier(indexDefinition.name)}: ${factory}("${indexDefinition.name}").on(${columns})`;
	});
	return `, (table) => ({\n${entries.join(",\n")}\n})`;
}

function renderDrizzleTable(table: CompiledDrizzleTable): string {
	const columns = table.columns.map(
		(column) => `\t${column.name}: ${renderDrizzleColumn(column)}`,
	);
	return `export const ${table.exportName} = sqliteTable("${table.tableName}", {\n${columns.join(",\n")}\n}${renderDrizzleIndexes(table)});\n`;
}

function sortModelsByReferences(storage: StorageRegistry): PersistentModel[] {
	const byKey = new Map(
		Object.values(storage.models).map((model) => [model.key, model]),
	);
	const visited = new Set<ModelKey>();
	const visiting = new Set<ModelKey>();
	const sorted: PersistentModel[] = [];

	function visit(model: PersistentModel) {
		if (visited.has(model.key)) return;
		if (visiting.has(model.key)) return;
		visiting.add(model.key);

		for (const field of Object.values(model.schema.fields)) {
			const referenced = field.reference
				? byKey.get(field.reference.model)
				: undefined;
			if (referenced && referenced.key !== model.key) {
				visit(referenced);
			}
		}

		visiting.delete(model.key);
		visited.add(model.key);
		sorted.push(model);
	}

	for (const model of Object.values(storage.models)) {
		visit(model);
	}

	return sorted;
}

export function compileDrizzleStorage(
	storage: StorageRegistry,
): CompiledDrizzleStorage {
	const tables = sortModelsByReferences(storage).map((model) =>
		compileDrizzleTable(model, storage),
	);
	const createTableStatements = tables.map(buildCreateTableStatementFromCompiled);
	const indexStatements = tables.flatMap((table) =>
		table.indexes.map((indexDefinition) =>
			buildIndexStatement(table, indexDefinition),
		),
	);
	const schemaSource = [
		`import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";`,
		"",
		...tables.map(renderDrizzleTable),
	].join("\n");

	return {
		tables,
		createTableStatements,
		indexStatements,
		syncStatements: [...createTableStatements, ...indexStatements],
		schemaSource,
	};
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
		schema: createDrizzleSchemaAdapter(db),
		create(context) {
			return createDrizzleAdapter({ ...context, db });
		},
	};
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
	await createDrizzleSchemaAdapter(db).sync?.({ storage });
}

export function createDrizzleSchemaAdapter(
	db?: DrizzleLibsqlDatabase,
): DatabaseSchemaAdapter {
	return {
		id: "drizzle-sqlite",

		generateSchemaFiles(input): GeneratedSchemaFile[] {
			return [
				{
					path: "drizzle.schema.ts",
					content: compileDrizzleStorage(input.storage).schemaSource,
				},
			];
		},

		getSyncStatements(input): readonly string[] {
			return compileDrizzleStorage(input.storage).syncStatements;
		},

		async sync(input): Promise<void> {
			const database = (input.database ?? db) as DrizzleLibsqlDatabase | undefined;
			if (!database) {
				throw new Error("Drizzle schema sync requires a database instance.");
			}
			const compiled = compileDrizzleStorage(input.storage);
			for (const statement of compiled.createTableStatements) {
				await database.run(sql.raw(statement));
			}

			for (const table of compiled.tables) {
				const existingColumns = await getExistingColumns(database, table.tableName);

				for (const column of table.columns) {
					if (existingColumns.has(column.name)) continue;
					await database.run(
						sql.raw(buildAddColumnStatement(table.tableName, column)),
					);
				}
			}

			for (const statement of compiled.indexStatements) {
				await database.run(sql.raw(statement));
			}
		},
	};
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

