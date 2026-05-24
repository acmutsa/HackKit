import type {
	DatabaseAdapter,
	DatabaseAdapterFactory,
	DatabaseAdapterFactoryContext,
	FindManyOptions,
	InferInsert,
	InferSelect,
	Model,
	StorageRegistry,
} from "../../database";

type Row = Record<string, unknown>;

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

function matchesWhere(row: Row, where: Record<string, unknown>): boolean {
	return Object.entries(where).every(([key, value]) => row[key] === value);
}

function createMemoryAdapter(
	context: DatabaseAdapterFactoryContext,
): DatabaseAdapter {
	const tables = new Map<string, Row[]>();

	function getTable(modelKey: string): Row[] {
		const existing = tables.get(modelKey);
		if (existing) return existing;
		const created: Row[] = [];
		tables.set(modelKey, created);
		return created;
	}

	return {
		async insert(model, value) {
			const row = applyDefaults(model, value, context);
			getTable(model.key).push({ ...row });
			return row as InferSelect<typeof model>;
		},

		async findOne(model, where) {
			const [row] = await this.findMany(model, { where, limit: 1 });
			return row ?? null;
		},

		async findMany(model, options) {
			let rows = [...getTable(model.key)];
			if (options?.where) {
				rows = rows.filter((row) =>
					matchesWhere(row, options.where as Record<string, unknown>),
				);
			}
			if (options?.orderBy) {
				const { field, direction } = options.orderBy;
				const fieldName = field as string;
				rows.sort((left, right) => {
					const leftValue = left[fieldName];
					const rightValue = right[fieldName];
					if (leftValue === rightValue) return 0;
					if (leftValue == null && rightValue == null) return 0;
					if (leftValue == null) return 1;
					if (rightValue == null) return -1;
					const comparison =
						leftValue < rightValue ? -1 : leftValue > rightValue ? 1 : 0;
					return direction === "desc" ? -comparison : comparison;
				});
			}
			if (options?.limit !== undefined) {
				rows = rows.slice(0, options.limit);
			}
			return rows as InferSelect<typeof model>[];
		},

		async update(model, where, patch) {
			const rows = getTable(model.key);
			const updated: InferSelect<typeof model>[] = [];
			for (const row of rows) {
				if (!matchesWhere(row, where as Record<string, unknown>)) continue;
				Object.assign(row, patch);
				updated.push({ ...row } as InferSelect<typeof model>);
			}
			return updated;
		},

		async delete(model, where) {
			const rows = getTable(model.key);
			const remaining = rows.filter(
				(row) => !matchesWhere(row, where as Record<string, unknown>),
			);
			const deletedCount = rows.length - remaining.length;
			tables.set(model.key, remaining);
			return deletedCount;
		},
	};
}

export function createInMemoryDatabaseAdapter(): DatabaseAdapterFactory {
	return {
		create(context) {
			return createMemoryAdapter(context);
		},
	};
}

export function createInMemoryDatabaseAdapterFromStorage(
	storage: StorageRegistry,
	now: () => Date = () => new Date(),
	id: () => string = () => crypto.randomUUID(),
): DatabaseAdapter {
	return createInMemoryDatabaseAdapter().create({ storage, now, id });
}
