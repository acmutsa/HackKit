import type {
	DatabaseAdapter,
	DatabaseAdapterFactory,
	DatabaseAdapterFactoryContext,
	InferInsert,
	InferSelect,
	Model,
} from "@hackkit/core";

function matches(
	row: Record<string, unknown>,
	where: Record<string, unknown>,
): boolean {
	return Object.entries(where).every(([key, value]) => row[key] === value);
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

export function createMemoryDatabaseAdapter(): DatabaseAdapterFactory {
	const tables = new Map<string, Record<string, unknown>[]>();

	function getTable(model: Model) {
		const key = model.key;
		if (!tables.has(key)) tables.set(key, []);
		return tables.get(key)!;
	}

	return {
		create(context): DatabaseAdapter {
			return {
				async insert(model, value) {
					const row = applyDefaults(model, value, context);
					getTable(model).push(row);
					return row;
				},

				async findOne(model, where) {
					return (
						(getTable(model).find((row) => matches(row, where)) as
							| InferSelect<typeof model>
							| undefined) ?? null
					);
				},

				async findMany(model, options) {
					let rows = [...getTable(model)];

					if (options?.where)
						rows = rows.filter((row) =>
							matches(
								row,
								options.where as Record<string, unknown>,
							),
						);

					if (options?.orderBy) {
						const { field, direction = "asc" } = options.orderBy;
						rows.sort((a, b) => {
							const left = a[String(field)];
							const right = b[String(field)];
							if (left === right) return 0;
							const result =
								String(left) > String(right) ? 1 : -1;
							return direction === "desc" ? -result : result;
						});
					}

					if (options?.limit !== undefined)
						rows = rows.slice(0, options.limit);

					return rows as InferSelect<typeof model>[];
				},

				async update(model, where, patch) {
					const table = getTable(model);
					const updated: Record<string, unknown>[] = [];

					for (let index = 0; index < table.length; index++) {
						const row = table[index]!;
						if (!matches(row, where)) continue;

						const next = { ...row, ...patch };
						table[index] = next;
						updated.push(next);
					}

					return updated as InferSelect<typeof model>[];
				},

				async delete(model, where) {
					const table = getTable(model);
					const remaining = table.filter(
						(row) => !matches(row, where),
					);
					const deleted = table.length - remaining.length;
					table.length = 0;
					table.push(...remaining);
					return deleted;
				},
			};
		},
	};
}
