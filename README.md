# Redis Movie Search
Next.js sample app for searching movie titles using Redis' full text index.
The metadata for films is exported from JSON [redis-movie-search/src/data](redis-movie-search/src/data)

## How to run
Make sure Node >= 20 is installed
1. Clone the repository to your computer
2. ``cd redis-movie-search/``
3. Specify connection string for Redis: rename ``.env.local.example`` into ``.env.local`` and change ``REDIS_CONNECTION_STRING`` to something like ``redis://your_user:your_password@your_redis_server_domain:your_redis_port``
4. Install the dependencies
```bash
npm install
```
5. Export data to the DB
```bash
npm run scripts:seed
```
Unless you're using a free-tier Redis Cloud DB, you may want to change how many movies are exported inside [seed.ts](redis-movie-search/src/scripts/seed.ts) by adjusting ``settings`` there.

6. Run Next.js app in dev mode
```bash
npm run dev
```

7. Open the app in the browser (typically at [http://localhost:3000](http://localhost:3000))

# Credit
The dataset of movies has been taken from [wikipedia-movie-data](https://github.com/prust/wikipedia-movie-data). All used data about movies is freely available through Wikipedia.