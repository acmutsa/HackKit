# Let database adapters own native schema generation and migration tooling

HackKit Core should continue to own an adapter-neutral Storage Schema, but it should not own one universal migration engine. Each concrete database adapter should be able to compile the merged HackKit Storage Schema into that adapter ecosystem's native schema format and then delegate migration diffing/apply behavior to that ecosystem's migration tooling.

For the Drizzle adapter, HackKit can generate concrete Drizzle schema files from the merged Storage Schema and then use Drizzle Kit to generate and apply migrations. Drizzle Kit is therefore a capability of the Drizzle adapter path, not a universal HackKit dependency. Other adapters can provide equivalent capabilities using their own native tools, such as Prisma Migrate for a Prisma adapter, TypeORM migrations for a TypeORM adapter, or generated SQL/Kysely migration files for a Kysely/raw SQL adapter.

This preserves the core architecture:

```txt
HackKit Core Storage Schema
  -> adapter-specific schema compiler
  -> native ORM/database schema files
  -> native migration tool
  -> runtime database adapter
```

Runtime persistence and migration management should be separate adapter capabilities. A runtime database adapter is used by HackKit Core while the app is running. A schema/migration adapter is used by the HackKit CLI at development or deployment time.

A future adapter shape could look like:

```ts
export type DatabaseAdapterFactory = {
	create(context: DatabaseAdapterFactoryContext): DatabaseAdapter;
	schema?: DatabaseSchemaAdapter;
};

export type DatabaseSchemaAdapter = {
	id: string;

	generateSchemaFiles(input: {
		storage: StorageRegistry;
		outDir: string;
	}): Promise<GeneratedFile[]>;

	getMigrationInstructions?(input: {
		schemaDir: string;
	}): string[];

	generateMigration?(input: {
		name: string;
		schemaDir: string;
		migrationsDir: string;
	}): Promise<void>;

	applyMigrations?(input: {
		migrationsDir: string;
	}): Promise<void>;
};
```

The HackKit CLI can then dispatch to the configured adapter:

```bash
hackkit db schema generate
hackkit db migration generate add-event-scans
hackkit db migrate
```

If an adapter does not expose `schema`, the CLI should fail with a clear message explaining that managed migrations are not supported for that adapter. This keeps simple adapters such as in-memory storage valid without forcing them to implement migration behavior.

Recommended implementation phases:

1. Add the adapter-facing schema/migration capability types.
2. Implement `hackkit db schema generate` for the Drizzle SQLite/libSQL adapter by generating Drizzle schema files into a HackKit-managed generated directory.
3. Keep Drizzle Kit invocation explicit or thinly wrapped at first so users can inspect generated schema and migration output.
4. Add `hackkit db migration generate <name>` and `hackkit db migrate` once the generated schema path and migration directory conventions are stable.
5. Later add migration metadata for hard schema evolution cases such as model renames, field renames, required-field backfills, plugin removal, and JSON shape changes.

The main design constraint is that HackKit Core must remain adapter-neutral. Drizzle Kit may be the preferred migration engine for the Drizzle adapter, but it should not leak into Core or become a requirement for non-Drizzle adapters.
