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

- [x] Add nav to month page
  - [x] income
  - [x] report
  - [x] transactions
- [x] add income feat
- [x] add shared feat
  - [x] share transaction amount with another table
  - [x] new query to show all shared amount totalled by category
  - [x] adjust other report queries to only show shared amount instead of total
- [ ] Add+edit incomes
- [ ] Add+edit transactions
- [ ] Add+edit years and months
- [ ] add+edit categories
- [ ] When items are add or edited page loads need to be invalidated
- [ ] User authorization+authentication
