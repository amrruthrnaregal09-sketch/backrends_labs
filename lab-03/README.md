# Lab 3: REST API, query parameters, validation, debugging

**Name:** Amrruth R Naregal  
**Registration number:** 252U1R9009  
**Section:** CSE Gen AI 2A  

**Live link:** Not deployed yet

## How to run

1. Install Node.js (LTS).
2. Open this folder in VS Code or a terminal.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. Open `http://localhost:3000/books` in a browser or Postman.

The application creates `books.db` and the `books` table automatically on first run. The default port is `3000`. To use another port, set the `PORT` environment variable.

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/books` | List books with search, sorting, pagination and price filters |
| GET | `/books/:bookId` | Get one book |
| POST | `/books` | Create a book |
| PUT | `/books/:bookId` | Update a book |
| DELETE | `/books/:bookId` | Delete a book |

### GET /books query parameters

- `search_q`: partial title search
- `order_by`: `book_id`, `title`, `author` or `price`
- `order`: `ASC` or `DESC`
- `limit`: number of records (default `10`)
- `offset`: number of records to skip (default `0`)
- `min_price`: minimum price
- `max_price`: maximum price

Example:

`GET http://localhost:3000/books?search_q=the&order_by=price&order=DESC&limit=5&offset=0&min_price=100&max_price=500`

## Postman tests

Import or copy the requests from `tests/requests.http`. Test both valid and invalid inputs. Expected status codes: 200 for successful reads/updates/deletes, 201 for create, 400 for invalid input and 404 for a missing book.

## Screenshots

Postman screenshots of the API responses:

- [GET all books](screenshots/01-get-all-books.png)
- [Search books](screenshots/02-search-books.png)
- [Sort books by price](screenshots/03-sort-by-price.png)
- [Paginate books](screenshots/04-pagination.png)
- [Filter by price range](screenshots/05-price-range.png)
- [Get a book by ID](screenshots/06-get-book-by-id.png)
- [Additional GET all books response](screenshots/07-get-all-books.png)
- [Validation error](screenshots/08-validation-error.png)
- [Delete a book](screenshots/09-delete-book.png)
- [Additional GET all books response](screenshots/10-get-all-books.png)

The screenshots show requests and responses made against the local server at `http://localhost:3000`.
## Debugging notes

- `EADDRINUSE`: another process is using the port. Stop that process or run the app on another port.
- `Cannot find module`: check the import path and file name.
- `no such table`: verify the database path and table name.
- Missing database result: make sure the database operation uses `await`.

## Problems faced and solutions

Add the errors you encountered and how you fixed them.

## Safety and submission

- Do not commit `.env`, passwords or `node_modules`.
- Use parameterized SQL queries for user-provided values.
- Commit your work regularly with meaningful messages.
- This project is in the `lab-03/` folder of the course GitHub repository.
