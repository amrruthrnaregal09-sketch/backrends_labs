# Lab 3: REST API, query parameters, validation, debugging

**Name:** Amrruth R Naregal  
**Registration number:** 252U1R9009  
**Section:** CSE Gen AI 2A  
**Course:** Backend Development Fundamentals · Year II Term II

## Live link
[https://backrends-labs-3.onrender.com](https://backrends-labs-3.onrender.com)

Books API: [https://backrends-labs-3.onrender.com/books](https://backrends-labs-3.onrender.com/books)

## How to run

1. Install Node.js (LTS).
2. Open this folder in VS Code / terminal.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. Open `http://localhost:3000/books`.

The SQLite database `books.db` is created automatically on first run and seeded with sample records. No environment variables are required locally. The server uses `PORT` if it is set; otherwise it uses port `3000`.

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/books` | List, search, sort, filter and paginate books |
| GET | `/books/:bookId` | Get one book by ID |
| POST | `/books` | Create a book |
| PUT | `/books/:bookId` | Update a book |
| DELETE | `/books/:bookId` | Delete a book |

### GET /books query parameters

- `search_q`: partial title search (default: empty)
- `order_by`: `book_id`, `title`, `author` or `price` (default: `book_id`)
- `order`: `ASC` or `DESC` (default: `ASC`)
- `limit`: 1–100 (default: `10`)
- `offset`: non-negative integer (default: `0`)
- `min_price`, `max_price`: optional price boundaries

Example:

```text
GET http://localhost:3000/books?search_q=the&order_by=price&order=DESC&limit=5&offset=0&min_price=100&max_price=500
```

### Create/update JSON body

```json
{
  "title": "Sample Book",
  "author": "Sample Author",
  "price": 299
}
```

## Postman / REST Client tests

Use the requests in `tests/requests.http`. Test successful requests and failure cases:
- Missing title, author or invalid price → `400`
- Unknown book ID → `404`
- Successful create → `201`
- Successful list, read, update and delete → `200`
- Invalid sort column/order, limit or offset → `400`

## Screenshots

Save screenshots of successful and failed API responses in this folder as `screenshots/`. Add them here using Markdown image links, for example:

`![GET books response](screenshots/get-books.png)`

No screenshots are included yet; capture your own output after running the project.

## Notes: problems faced and how you solved them

- `EADDRINUSE`: another process is using the port. Stop the old server with `Ctrl + C`, or run with another port.
- Wrong import path: check the file name and relative path.
- `no such table`: check that the SQL table is named `book` and that the database file path is correct.
- Missing `await`: await asynchronous database calls before using their results.

## Important

- Do not commit `node_modules/`, `.env`, passwords or secrets.
- SQL values are parameterized. The sort column is validated against an allowlist.
- Add your own Postman screenshots and GitHub repository link before submission.
