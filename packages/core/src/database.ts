export type ModelKey = `${string}.${string}`;
export type FieldKind =
	| "string"
	| "integer"
	| "number"
	| "boolean"
	| "date"
	| "json"
	| "enum";
export type StorageDefault<TValue> =
	| { kind: "static"; value: TValue }
	| { kind: "now" }
	| { kind: "id" };

export type ReferenceAction = "cascade" | "restrict" | "setNull" | "noAction";

export type FieldReference<TKey extends ModelKey = ModelKey> = {
	model: TKey;
	field: string;
	onDelete?: ReferenceAction;
	onUpdate?: ReferenceAction;
};

export type FieldDefinition<
	TValue,
	TOptional extends boolean = false,
	THasDefault extends boolean = false,
> = {
	kind: FieldKind;
	isOptional: TOptional;
	isPrimaryKey?: boolean;
	isUnique?: boolean;
	defaultValue?: StorageDefault<TValue>;
	reference?: FieldReference;
	enumValues?: readonly string[];
	readonly __value?: TValue;
	readonly __hasDefault?: THasDefault;
};

export type AnyField = FieldDefinition<unknown, boolean, boolean>;

export type FieldBuilder<
	TValue,
	TOptional extends boolean = false,
	THasDefault extends boolean = false,
> = FieldDefinition<TValue, TOptional, THasDefault> & {
	optional(): FieldBuilder<TValue, true, THasDefault>;
	primaryKey(): FieldBuilder<TValue, TOptional, THasDefault>;
	unique(): FieldBuilder<TValue, TOptional, THasDefault>;
	default(value: TValue): FieldBuilder<TValue, TOptional, true>;
	defaultNow(): TValue extends Date
		? FieldBuilder<TValue, TOptional, true>
		: never;
	defaultId(): TValue extends string
		? FieldBuilder<TValue, TOptional, true>
		: never;
	references<TKey extends ModelKey>(
		model: TKey,
		field: string,
		options?: { onDelete?: ReferenceAction; onUpdate?: ReferenceAction },
	): FieldBuilder<TValue, TOptional, THasDefault>;
};

function createField<
	TValue,
	TOptional extends boolean = false,
	THasDefault extends boolean = false,
>(
	definition: Omit<
		FieldDefinition<TValue, TOptional, THasDefault>,
		"__value" | "__hasDefault"
	>,
): FieldBuilder<TValue, TOptional, THasDefault> {
	const withDefinition = <
		TNextValue,
		TNextOptional extends boolean,
		TNextHasDefault extends boolean,
	>(
		next: Omit<
			FieldDefinition<TNextValue, TNextOptional, TNextHasDefault>,
			"__value" | "__hasDefault"
		>,
	) => createField<TNextValue, TNextOptional, TNextHasDefault>(next);

	return {
		...definition,
		optional() {
			return withDefinition<TValue, true, THasDefault>({
				...definition,
				isOptional: true,
			});
		},
		primaryKey() {
			return withDefinition<TValue, TOptional, THasDefault>({
				...definition,
				isPrimaryKey: true,
			});
		},
		unique() {
			return withDefinition<TValue, TOptional, THasDefault>({
				...definition,
				isUnique: true,
			});
		},
		default(value: TValue) {
			return withDefinition<TValue, TOptional, true>({
				...definition,
				defaultValue: { kind: "static", value },
			});
		},
		defaultNow() {
			return withDefinition<TValue, TOptional, true>({
				...definition,
				defaultValue: { kind: "now" },
			}) as never;
		},
		defaultId() {
			return withDefinition<TValue, TOptional, true>({
				...definition,
				defaultValue: { kind: "id" },
			}) as never;
		},
		references(modelKey, field, options) {
			return withDefinition<TValue, TOptional, THasDefault>({
				...definition,
				reference: { model: modelKey, field, ...options },
			});
		},
	};
}

export const field = {
	string: () => createField<string>({ kind: "string", isOptional: false }),
	integer: () => createField<number>({ kind: "integer", isOptional: false }),
	number: () => createField<number>({ kind: "number", isOptional: false }),
	boolean: () => createField<boolean>({ kind: "boolean", isOptional: false }),
	date: () => createField<Date>({ kind: "date", isOptional: false }),
	json: <TValue>() =>
		createField<TValue>({ kind: "json", isOptional: false }),
	enum: <const TValues extends readonly [string, ...string[]]>(
		values: TValues,
	) =>
		createField<TValues[number]>({
			kind: "enum",
			isOptional: false,
			enumValues: values,
		}),
} as const;

export type FieldValue<TField extends AnyField> =
	TField extends FieldDefinition<infer TValue, boolean, boolean>
		? TValue
		: never;
export type FieldIsOptional<TField extends AnyField> =
	TField extends FieldDefinition<unknown, infer TOptional, boolean>
		? TOptional
		: never;
export type FieldHasDefault<TField extends AnyField> =
	TField extends FieldDefinition<unknown, boolean, infer THasDefault>
		? THasDefault
		: never;

export type FieldMap = Record<string, AnyField>;

export type ModelDefinition<TFields extends FieldMap = FieldMap> = {
	fields: TFields;
	unique?: readonly (readonly (keyof TFields & string)[])[];
	indexes?: readonly (readonly (keyof TFields & string)[])[];
};

export type Model<
	TDefinition extends ModelDefinition = ModelDefinition,
	TKey extends ModelKey = ModelKey,
> = {
	readonly key: TKey;
	readonly schema: TDefinition;
};

export type PersistentModel = Model<ModelDefinition, ModelKey>;

export function defineModel<
	const TKey extends ModelKey,
	const TDefinition extends ModelDefinition,
>(key: TKey, schema: TDefinition): Model<TDefinition, TKey> {
	return { key, schema };
}

export const model = defineModel;

type OptionalSelectKeys<TFields extends FieldMap> = {
	[K in keyof TFields]: FieldIsOptional<TFields[K]> extends true ? K : never;
}[keyof TFields];

type RequiredSelectKeys<TFields extends FieldMap> = Exclude<
	keyof TFields,
	OptionalSelectKeys<TFields>
>;

type OptionalInsertKeys<TFields extends FieldMap> = {
	[K in keyof TFields]: FieldIsOptional<TFields[K]> extends true
		? K
		: FieldHasDefault<TFields[K]> extends true
			? K
			: never;
}[keyof TFields];

type RequiredInsertKeys<TFields extends FieldMap> = Exclude<
	keyof TFields,
	OptionalInsertKeys<TFields>
>;

export type InferSelect<TModel extends Model> =
	TModel extends Model<infer TDefinition, ModelKey>
		? {
				[K in RequiredSelectKeys<TDefinition["fields"]>]: FieldValue<
					TDefinition["fields"][K]
				>;
			} & {
				[K in OptionalSelectKeys<TDefinition["fields"]>]?: FieldValue<
					TDefinition["fields"][K]
				>;
			}
		: never;

export type InferInsert<TModel extends Model> =
	TModel extends Model<infer TDefinition, ModelKey>
		? {
				[K in RequiredInsertKeys<TDefinition["fields"]>]: FieldValue<
					TDefinition["fields"][K]
				>;
			} & {
				[K in OptionalInsertKeys<TDefinition["fields"]>]?: FieldValue<
					TDefinition["fields"][K]
				>;
			}
		: never;

export type Where<TModel extends Model> = Partial<InferSelect<TModel>>;

export type OrderBy<TModel extends Model> = {
	field: keyof InferSelect<TModel>;
	direction?: "asc" | "desc";
};

export type FindManyOptions<TModel extends Model> = {
	where?: Where<TModel>;
	orderBy?: OrderBy<TModel>;
	limit?: number;
};

export type StorageRegistry = {
	models: Record<string, PersistentModel>;
};

export type DatabaseAdapterFactoryContext = {
	storage: StorageRegistry;
	now: () => Date;
	id: () => string;
};

export type DatabaseAdapter = {
	insert<TModel extends Model>(
		model: TModel,
		value: InferInsert<TModel>,
	): Promise<InferSelect<TModel>>;
	findOne<TModel extends Model>(
		model: TModel,
		where: Where<TModel>,
	): Promise<InferSelect<TModel> | null>;
	findMany<TModel extends Model>(
		model: TModel,
		options?: FindManyOptions<TModel>,
	): Promise<InferSelect<TModel>[]>;
	update<TModel extends Model>(
		model: TModel,
		where: Where<TModel>,
		patch: Partial<InferSelect<TModel>>,
	): Promise<InferSelect<TModel>[]>;
	delete<TModel extends Model>(
		model: TModel,
		where: Where<TModel>,
	): Promise<number>;
};

export type DatabaseAdapterFactory = {
	create(context: DatabaseAdapterFactoryContext): DatabaseAdapter;
};

export type DatabaseAdapterInput = DatabaseAdapter | DatabaseAdapterFactory;

export function isDatabaseAdapterFactory(
	input: DatabaseAdapterInput,
): input is DatabaseAdapterFactory {
	return typeof (input as DatabaseAdapterFactory).create === "function";
}
