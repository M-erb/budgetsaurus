# Budgetsaurus

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## First time Dev setup

Install packages:
```bash
npm i
```

Create the local sqlite db file and populate with latest migrations+seed:
```bash
touch ./drizzle/dev_db.db

# create a .env file based on ".example.env" and add whatever you named your dev db in the "TURSO_URL" variable

# populdate the dev db file with the schema
npm run dev-migrate

# if you need starting rando data
npm run dev-seed
```

Start a development server:
```bash
npm run dev
```

If you have edit the Schema (`src/lib/server/schema.ts`) file then you need to create a new migration file and apply it to the dev server:
```bash
# first generate the drizzle migration files
npm run gen-migrate

# then apply the migration to the dev db
npm run dev-migrate
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## TODOs

* Add nav to month page
	* income
	* report
	* transactions
* add income feat
* add shared feat
	* share transaction amount with another table
	* new query to show all shared amount totalled by category
	* adjust other report queries to only show shared amount instead of total