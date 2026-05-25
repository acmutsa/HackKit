import { drizzle } from "drizzle-orm/libsql";

//#region ../core/dist/database.d.ts
type ModelKey = `${string}.${string}`;
type FieldKind = "string" | "integer" | "number" | "boolean" | "date" | "json" | "enum";
type StorageDefault<TValue> = {
  kind: "static";
  value: TValue;
} | {
  kind: "now";
} | {
  kind: "id";
};
type ReferenceAction = "cascade" | "restrict" | "setNull" | "noAction";
type FieldReference<TKey extends ModelKey = ModelKey> = {
  model: TKey;
  field: string;
  onDelete?: ReferenceAction;
  onUpdate?: ReferenceAction;
};
type FieldDefinition<TValue, TOptional extends boolean = false, THasDefault extends boolean = false> = {
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
type AnyField = FieldDefinition<unknown, boolean, boolean>;
type FieldValue<TField extends AnyField> = TField extends FieldDefinition<infer TValue, boolean, boolean> ? TValue : never;
type FieldIsOptional<TField extends AnyField> = TField extends FieldDefinition<unknown, infer TOptional, boolean> ? TOptional : never;
type FieldHasDefault<TField extends AnyField> = TField extends FieldDefinition<unknown, boolean, infer THasDefault> ? THasDefault : never;
type FieldMap = Record<string, AnyField>;
type ModelDefinition<TFields extends FieldMap = FieldMap> = {
  fields: TFields;
  unique?: readonly (readonly (keyof TFields & string)[])[];
  indexes?: readonly (readonly (keyof TFields & string)[])[];
};
type Model<TDefinition extends ModelDefinition = ModelDefinition, TKey extends ModelKey = ModelKey> = {
  readonly key: TKey;
  readonly schema: TDefinition;
};
type PersistentModel = Model<ModelDefinition, ModelKey>;
type OptionalSelectKeys<TFields extends FieldMap> = { [K in keyof TFields]: FieldIsOptional<TFields[K]> extends true ? K : never }[keyof TFields];
type RequiredSelectKeys<TFields extends FieldMap> = Exclude<keyof TFields, OptionalSelectKeys<TFields>>;
type OptionalInsertKeys<TFields extends FieldMap> = { [K in keyof TFields]: FieldIsOptional<TFields[K]> extends true ? K : FieldHasDefault<TFields[K]> extends true ? K : never }[keyof TFields];
type RequiredInsertKeys<TFields extends FieldMap> = Exclude<keyof TFields, OptionalInsertKeys<TFields>>;
type InferSelect<TModel extends Model> = TModel extends Model<infer TDefinition, ModelKey> ? { [K in RequiredSelectKeys<TDefinition["fields"]>]: FieldValue<TDefinition["fields"][K]> } & { [K in OptionalSelectKeys<TDefinition["fields"]>]?: FieldValue<TDefinition["fields"][K]> } : never;
type InferInsert<TModel extends Model> = TModel extends Model<infer TDefinition, ModelKey> ? { [K in RequiredInsertKeys<TDefinition["fields"]>]: FieldValue<TDefinition["fields"][K]> } & { [K in OptionalInsertKeys<TDefinition["fields"]>]?: FieldValue<TDefinition["fields"][K]> } : never;
type Where<TModel extends Model> = Partial<InferSelect<TModel>>;
type OrderBy<TModel extends Model> = {
  field: keyof InferSelect<TModel>;
  direction?: "asc" | "desc";
};
type FindManyOptions<TModel extends Model> = {
  where?: Where<TModel>;
  orderBy?: OrderBy<TModel>;
  limit?: number;
};
type StorageRegistry = {
  models: Record<string, PersistentModel>;
};
type DatabaseAdapter = {
  insert<TModel extends Model>(model: TModel, value: InferInsert<TModel>): Promise<InferSelect<TModel>>;
  findOne<TModel extends Model>(model: TModel, where: Where<TModel>): Promise<InferSelect<TModel> | null>;
  findMany<TModel extends Model>(model: TModel, options?: FindManyOptions<TModel>): Promise<InferSelect<TModel>[]>;
  update<TModel extends Model>(model: TModel, where: Where<TModel>, patch: Partial<InferSelect<TModel>>): Promise<InferSelect<TModel>[]>;
  delete<TModel extends Model>(model: TModel, where: Where<TModel>): Promise<number>;
};
//#endregion
//#region ../core/dist/types.d.ts
type AuthId = string;
type PermissionKey = `${string}.${string}`;
//#endregion
//#region ../core/dist/adapters/auth.d.ts
type AuthSession = {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
  };
};
type AuthIdentity = {
  email: string;
  firstName: string;
  lastName: string;
  profilePhotoUrl?: string;
};
type AuthAdapter = {
  getSession(): Promise<AuthSession | null>;
  toAuthId(session: AuthSession): AuthId;
  getIdentity(session: AuthSession): AuthIdentity;
  syncStorage?(database: unknown): Promise<void>;
};
//#endregion
//#region ../core/dist/plugins.d.ts
type ModelMap = Record<string, PersistentModel>;
type PermissionMap = Record<string, PermissionKey>;
type HackKitPluginContext = {
  database: DatabaseAdapter;
  registry: HackKitRegistry;
};
type HackKitPlugin<TId extends string = string, TApi extends object = Record<string, never>> = {
  id: TId;
  models?: ModelMap;
  permissions?: PermissionMap;
  setup?: (context: HackKitPluginContext) => TApi;
};
type HackKitRegistry = {
  models: Record<string, PersistentModel>;
  permissions: Record<string, PermissionKey>;
  plugins: Record<string, HackKitPlugin>;
  storage: StorageRegistry;
};
//#endregion
//#region ../core/dist/event-types.d.ts
type EventTypeOption = {
  value: string;
  label: string;
  color: string;
};
type EventTypesInput = readonly EventTypeOption[];
//#endregion
//#region ../core/dist/user-data-options.d.ts
type UserDataOption = {
  value: string;
  label: string;
};
type UserDataOptions = {
  gender: readonly UserDataOption[];
  race: readonly UserDataOption[];
  ethnicity: readonly UserDataOption[];
  shirtSize: readonly UserDataOption[];
  dietaryRestrictions: readonly UserDataOption[];
  countryOfResidence: readonly UserDataOption[];
};
type UserDataOptionsInput = Partial<UserDataOptions>;
//#endregion
//#region src/config.d.ts
type HackkitConfig = {
  plugins?: readonly HackKitPlugin[];
  databaseUrl: string;
  userDataOptions?: UserDataOptionsInput;
  eventTypes?: EventTypesInput;
  auth?: Pick<AuthAdapter, "syncStorage">;
};
declare function defineHackkitConfig<const T extends HackkitConfig>(config: T): T;
//#endregion
//#region src/db-sync.d.ts
declare function runDbSync(config: HackkitConfig): Promise<void>;
//#endregion
export { type HackkitConfig, defineHackkitConfig, runDbSync };
//# sourceMappingURL=index.d.ts.map