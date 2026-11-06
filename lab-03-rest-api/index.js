const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "books.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS book (
        book_id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price REAL NOT NULL
      )
    `);

    const countRow = await db.get("SELECT COUNT(*) AS count FROM book");
    if (countRow.count === 0) {
      const seedBooks = [
        ["The Alchemist", "Paulo Coelho", 299],
        ["Wings of Fire", "A. P. J. Abdul Kalam", 250],
        ["Atomic Habits", "James Clear", 450],
        ["Ikigai", "Hector Garcia", 350],
        ["Deep Work", "Cal Newport", 399],
        ["Rich Dad Poor Dad", "Robert Kiyosaki", 299],
        ["The Power of Habit", "Charles Duhigg", 375],
        ["Think Like a Monk", "Jay Shetty", 425],
        ["The 5 AM Club", "Robin Sharma", 320],
        ["Do Epic Shit", "Ankur Warikoo", 299],
      ];
      const insert = await db.prepare(
        "INSERT INTO book (title, author, price) VALUES (?, ?, ?)"
      );
      try {
        for (const book of seedBooks) {
          await insert.run(book[0], book[1], book[2]);
        }
      } finally {
        await insert.finalize();
      }
    }

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    process.exit(1);
  }
};

const parseNumber = (value) => {
  if (value === undefined) return undefined;
  if (value.trim() === "") return NaN;
  return Number(value);
};

// GET /books?search_q=...&order_by=title&order=ASC&limit=5&offset=0
// Optional price filter: min_price=100&max_price=500
app.get("/books", async (request, response) => {
  try {
    const {
      search_q = "",
      order_by = "book_id",
      order = "ASC",
      limit: limitValue = "10",
      offset: offsetValue = "0",
      min_price: minPriceValue,
      max_price: maxPriceValue,
    } = request.query;

    const allowedOrderColumns = ["book_id", "title", "author", "price"];
    const normalizedOrder = String(order).toUpperCase();
    if (!allowedOrderColumns.includes(order_by)) {
      return response.status(400).json({ message: "Invalid order_by value." });
    }
    if (!["ASC", "DESC"].includes(normalizedOrder)) {
      return response.status(400).json({ message: "order must be ASC or DESC." });
    }

    const limit = parseNumber(String(limitValue));
    const offset = parseNumber(String(offsetValue));
    const minPrice = parseNumber(minPriceValue);
    const maxPrice = parseNumber(maxPriceValue);

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return response.status(400).json({ message: "limit must be an integer from 1 to 100." });
    }
    if (!Number.isInteger(offset) || offset < 0) {
      return response.status(400).json({ message: "offset must be a non-negative integer." });
    }
    if (minPriceValue !== undefined && (!Number.isFinite(minPrice) || minPrice < 0)) {
      return response.status(400).json({ message: "min_price must be a non-negative number." });
    }
    if (maxPriceValue !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0)) {
      return response.status(400).json({ message: "max_price must be a non-negative number." });
    }
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      return response.status(400).json({ message: "min_price cannot be greater than max_price." });
    }

    let query = "SELECT * FROM book WHERE title LIKE ?";
    const params = [`%${search_q}%`];

    if (minPrice !== undefined) {
      query += " AND price >= ?";
      params.push(minPrice);
    }
    if (maxPrice !== undefined) {
      query += " AND price <= ?";
      params.push(maxPrice);
    }

    // order_by is selected only from the whitelist above; values remain parameterized.
    query += ` ORDER BY ${order_by} ${normalizedOrder} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const books = await db.all(query, params);
    return response.status(200).json(books);
  } catch (error) {
    return response.status(500).json({ message: "Unable to fetch books.", error: error.message });
  }
});

// GET /books/:bookId
app.get("/books/:bookId", async (request, response) => {
  try {
    const book = await db.get(
      "SELECT * FROM book WHERE book_id = ?",
      [request.params.bookId]
    );
    if (!book) {
      return response.status(404).json({ message: "Book not found." });
    }
    return response.status(200).json(book);
  } catch (error) {
    return response.status(500).json({ message: "Unable to fetch book." });
  }
});

// POST /books
app.post("/books", async (request, response) => {
  try {
    const { title, author, price } = request.body;
    if (
      typeof title !== "string" || title.trim() === "" ||
      typeof author !== "string" || author.trim() === "" ||
      price === undefined || price === null || price === "" ||
      !Number.isFinite(Number(price))
    ) {
      return response.status(400).json({
        message: "title and author are required, and price must be a number.",
      });
    }
    if (Number(price) < 0) {
      return response.status(400).json({ message: "price cannot be negative." });
    }

    const result = await db.run(
      "INSERT INTO book (title, author, price) VALUES (?, ?, ?)",
      [title.trim(), author.trim(), Number(price)]
    );
    const newBook = await db.get("SELECT * FROM book WHERE book_id = ?", [result.lastID]);
    return response.status(201).json({
      message: "Book created successfully.",
      book: newBook,
    });
  } catch (error) {
    return response.status(500).json({ message: "Unable to create book." });
  }
});

// PUT /books/:bookId
app.put("/books/:bookId", async (request, response) => {
  try {
    const { title, author, price } = request.body;
    if (
      typeof title !== "string" || title.trim() === "" ||
      typeof author !== "string" || author.trim() === "" ||
      price === undefined || price === null || price === "" ||
      !Number.isFinite(Number(price)) || Number(price) < 0
    ) {
      return response.status(400).json({
        message: "title and author are required, and price must be a non-negative number.",
      });
    }

    const existingBook = await db.get(
      "SELECT * FROM book WHERE book_id = ?",
      [request.params.bookId]
    );
    if (!existingBook) {
      return response.status(404).json({ message: "Book not found." });
    }

    await db.run(
      "UPDATE book SET title = ?, author = ?, price = ? WHERE book_id = ?",
      [title.trim(), author.trim(), Number(price), request.params.bookId]
    );
    const updatedBook = await db.get(
      "SELECT * FROM book WHERE book_id = ?",
      [request.params.bookId]
    );
    return response.status(200).json({
      message: "Book updated successfully.",
      book: updatedBook,
    });
  } catch (error) {
    return response.status(500).json({ message: "Unable to update book." });
  }
});

// DELETE /books/:bookId
app.delete("/books/:bookId", async (request, response) => {
  try {
    const existingBook = await db.get(
      "SELECT * FROM book WHERE book_id = ?",
      [request.params.bookId]
    );
    if (!existingBook) {
      return response.status(404).json({ message: "Book not found." });
    }

    await db.run("DELETE FROM book WHERE book_id = ?", [request.params.bookId]);
    return response.status(200).json({ message: "Book deleted successfully." });
  } catch (error) {
    return response.status(500).json({ message: "Unable to delete book." });
  }
});

initializeDBAndServer();
