# Lab 2: SQLite database and CRUD routes

**Name:** Amruth · **Registration number:** `<your reg. no.>` · **Section:** `<your section>`

**Backend Development Fundamentals** · Year II Term II · Faculty: Joel Prashanth D

**Live link:** `<paste your Render / Railway / NxtWave Cloud IDE URL here>`
*(If you could not deploy, replace this line with the reason, and keep the Postman screenshots below.)*

## Objective

Connect an Express server to a SQLite database and expose CRUD (Create, Read, Update, Delete) operations over HTTP.

## Project structure

```
lab-02/
├── index.js                  # Express server + all 5 routes
├── books.db                  # SQLite database file (table: book, 10 rows)
├── sql/schema_and_seed.sql   # SQL used to create the table and insert rows
├── tests/requests.http       # Requests to import into Postman
├── tests/curl_test_output.txt# Output of my test run (status codes + responses)
├── screenshots/              # Postman and SQLite CLI screenshots
├── package.json
├── .env.example
└── .gitignore                # node_modules and .env are not committed
```

## How to run

```bash
# 1. Install packages (express, sqlite, sqlite3, nodemon)
npm install

# 2. (Optional) create the database again from scratch with the SQLite CLI
sqlite3 books.db < sql/schema_and_seed.sql

# 3. Start the server
npm run dev        # nodemon: restarts on every file change
# or
npm start          # plain node
```

The server runs at `http://localhost:3000/`.

**Environment variables** (optional, see `.env.example`):

| Variable | Meaning | Default |
| --- | --- | --- |
| `PORT` | Port the server listens on | `3000` |

## Database

Table `book`:

| Column | Type | Note |
| --- | --- | --- |
| id | INTEGER | PRIMARY KEY (auto-increments) |
| title | TEXT | |
| author | TEXT | |
| price | INTEGER | |
| pages | INTEGER | |

10 rows were inserted using the SQLite CLI (`sql/schema_and_seed.sql`).

## Endpoints

| Method | Path | Description | Success | Errors |
| --- | --- | --- | --- | --- |
| GET | `/books/` | Get all books | 200 | 500 |
| GET | `/books/:bookId/` | Get one book by id | 200 | 400 invalid id, 404 not found |
| POST | `/books/` | Add a new book (JSON body) | 201 `{ "bookId": 11 }` | 400 bad body |
| PUT | `/books/:bookId/` | Update all fields of a book | 200 | 400 bad id/body, 404 not found |
| DELETE | `/books/:bookId/` | Delete a book | 200 | 400 invalid id, 404 not found |

Body for POST and PUT:

```json
{ "title": "Gitanjali", "author": "Rabindranath Tagore", "price": 180, "pages": 120 }
```

## How the code works

- `initializeDBAndServer()` is one `async` function. It opens the database with `await open(...)` and calls `app.listen()` **only after** the connection succeeds. If opening fails, it prints the error and exits.
- Every query that uses user input has `?` placeholders and the values are passed separately, for example `db.get("SELECT * FROM book WHERE id = ?", [bookId])`. SQL is never built by joining strings.
- Every route is wrapped in `try/catch` and returns the right status code (200, 201, 400, 404, 500).
- Passwords are not used in this lab, so nothing sensitive is stored or logged.

## Screenshots

Add these after you run the project (take them from Postman and the SQLite CLI), save them in `screenshots/`, and keep the captions.

![GET all books](screenshots/01-get-all-books.png)
![GET one book](screenshots/02-get-one-book.png)
![GET book not found (404)](screenshots/03-get-not-found.png)
![POST add a book (201)](screenshots/04-post-book.png)
![PUT update a book](screenshots/05-put-book.png)
![DELETE a book](screenshots/06-delete-book.png)
![Validation error (400)](screenshots/07-validation-error.png)
![SQLite CLI: SELECT * FROM book; after POST, PUT and DELETE](screenshots/08-sqlite-cli.png)

My test run with `curl` (status codes and responses for all routes) is saved in `tests/curl_test_output.txt`.

## Compare with the SQLite CLI

```bash
sqlite3 books.db
sqlite> SELECT * FROM book;
sqlite> SELECT * FROM book WHERE id = 11;
```

After POST the new row appears, after PUT the row's values change, and after DELETE the row is gone. This shows the `.db` file changes.

## Viva answers (short)

**Why await the database call?**
Database calls take time and return a Promise. `await` pauses that function until the result is ready, so the next line gets the real data and not a pending Promise. The rest of the server keeps working meanwhile.

**What is SQL injection and how do placeholders prevent it?**
SQL injection is when a user types SQL code into an input and it gets joined into the query, so the database runs it (for example `1 OR 1=1`, or `'); DROP TABLE book;--`). With `?` placeholders the query text is fixed first and the values are sent separately, so the database always treats them as plain data, never as SQL. In my test the text `x'); DROP TABLE book;--` was saved as an ordinary title and the table was not harmed.

**When is PUT used instead of POST?**
POST creates a new resource and the server picks the id. PUT updates an existing resource at a known URL (`/books/11/`) and replaces its values.

## Notes: problems faced and how I solved them

- *Server starting before the database was ready:* solved by starting `app.listen()` inside `initializeDBAndServer()` after `await open(...)`.
- *Invalid ids like `1 OR 1=1` in the URL:* the id is checked to be a positive whole number (400 otherwise), and the query also uses `?`.
- *PUT/DELETE on an id that does not exist:* `dbResponse.changes` is checked, and the route returns 404 instead of a false success.
- `<add any other problem you faced, e.g. npm install errors, port already in use>`
