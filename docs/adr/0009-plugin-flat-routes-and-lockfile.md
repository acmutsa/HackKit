# Flat-merge plugin routes and hackkit.lock

HackKit plugins ship Next.js `app/` routes that the CLI merges into a HackKit Web App using generated re-export stubs at matching host paths (flat merge). A committed `hackkit.lock` records which plugin owns each generated stub and action wrapper; `hackkit plugin sync` is the single writer and fails fast when two plugins claim the same host path or a protected core route.
