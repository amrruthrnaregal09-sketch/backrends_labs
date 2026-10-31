const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "books.db");
const PORT = process.env.PORT || 3000;

let db = null;

// Open the database first, then start the server only if that succeeds.
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// Check that a value is a whole number >= 0
const isValidNumber = (value) => Number.isInteger(value) && value >= 0;

// Check the body of POST and PUT requests. Returns an error message or null.
const validateBook = (body) => {
  const { title, author, price, pages } = body;
  if (typeof title !== "string" || title.trim() === "") {
    return "title must be a non-empty string";
  }
  if (typeof author !== "string" || author.trim() === "") {
    return "author must be a non-empty string";
  }
  if (!isValidNumber(price)) {
    return "price must be a whole number (0 or more)";
  }
  if (!isValidNumber(pages)) {
    return "pages must be a whole number (0 or more)";
  }
  return null;
};

// bookId in the URL must be a positive whole number
const isValidId = (id) => /^[1-9][0-9]*$/.test(id);

// 1. GET all books
app.get("/books/", async (request, response) => {
  try {
    const getBooksQuery = `SELECT * FROM book ORDER BY id;`;
    const books = await db.all(getBooksQuery);
    response.status(200).send(books);
  } catch (error) {
    response.status(500).send({ error: "Internal server error" });
  }
});

// 2. GET one book
app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  if (!isValidId(bookId)) {
    return response.status(400).send({ error: "Invalid book id" });
  }
  try {
    const getBookQuery = `SELECT * FROM book WHERE id = ?;`;
    const book = await db.get(getBookQuery, [bookId]);
    if (book === undefined) {
      return response.status(404).send({ error: "Book not found" });
    }
    response.status(200).send(book);
  } catch (error) {
    response.status(500).send({ error: "Internal server error" });
  }
});

// 3. POST add a book
app.post("/books/", async (request, response) => {
  const errorMessage = validateBook(request.body);
  if (errorMessage) {
    return response.status(400).send({ error: errorMessage });
  }
  const { title, author, price, pages } = request.body;
  try {
    const addBookQuery = `
      INSERT INTO book (title, author, price, pages)
      VALUES (?, ?, ?, ?);`;
    const dbResponse = await db.run(addBookQuery, [title, author, price, pages]);
    response.status(201).send({ bookId: dbResponse.lastID });
  } catch (error) {
    response.status(500).send({ error: "Internal server error" });
  }
});

// 4. PUT update a book (all fields are replaced)
app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  if (!isValidId(bookId)) {
    return response.status(400).send({ error: "Invalid book id" });
  }
  const errorMessage = validateBook(request.body);
  if (errorMessage) {
    return response.status(400).send({ error: errorMessage });
  }
  const { title, author, price, pages } = request.body;
  try {
    const updateBookQuery = `
      UPDATE book
      SET title = ?, author = ?, price = ?, pages = ?
      WHERE id = ?;`;
    const dbResponse = await db.run(updateBookQuery, [
      title,
      author,
      price,
      pages,
      bookId,
    ]);
    if (dbResponse.changes === 0) {
      return response.status(404).send({ error: "Book not found" });
    }
    response.status(200).send({ message: "Book updated successfully" });
  } catch (error) {
    response.status(500).send({ error: "Internal server error" });
  }
});

// 5. DELETE a book
app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  if (!isValidId(bookId)) {
    return response.status(400).send({ error: "Invalid book id" });
  }
  try {
    const deleteBookQuery = `DELETE FROM book WHERE id = ?;`;
    const dbResponse = await db.run(deleteBookQuery, [bookId]);
    if (dbResponse.changes === 0) {
      return response.status(404).send({ error: "Book not found" });
    }
    response.status(200).send({ message: "Book deleted successfully" });
  } catch (error) {
    response.status(500).send({ error: "Internal server error" });
  }
});

module.exports = app;
