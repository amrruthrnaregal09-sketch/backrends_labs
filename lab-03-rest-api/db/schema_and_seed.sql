CREATE TABLE IF NOT EXISTS book (
  book_id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price REAL NOT NULL
);

INSERT INTO book (title, author, price)
SELECT 'The Alchemist', 'Paulo Coelho', 299
WHERE NOT EXISTS (SELECT 1 FROM book);

INSERT INTO book (title, author, price)
SELECT 'Wings of Fire', 'A. P. J. Abdul Kalam', 250
WHERE (SELECT COUNT(*) FROM book) = 1;

INSERT INTO book (title, author, price)
SELECT 'Atomic Habits', 'James Clear', 450
WHERE (SELECT COUNT(*) FROM book) = 2;

INSERT INTO book (title, author, price)
SELECT 'Ikigai', 'Hector Garcia', 350
WHERE (SELECT COUNT(*) FROM book) = 3;

INSERT INTO book (title, author, price)
SELECT 'Deep Work', 'Cal Newport', 399
WHERE (SELECT COUNT(*) FROM book) = 4;

INSERT INTO book (title, author, price)
SELECT 'Rich Dad Poor Dad', 'Robert Kiyosaki', 299
WHERE (SELECT COUNT(*) FROM book) = 5;

INSERT INTO book (title, author, price)
SELECT 'The Power of Habit', 'Charles Duhigg', 375
WHERE (SELECT COUNT(*) FROM book) = 6;

INSERT INTO book (title, author, price)
SELECT 'Think Like a Monk', 'Jay Shetty', 425
WHERE (SELECT COUNT(*) FROM book) = 7;

INSERT INTO book (title, author, price)
SELECT 'The 5 AM Club', 'Robin Sharma', 320
WHERE (SELECT COUNT(*) FROM book) = 8;

INSERT INTO book (title, author, price)
SELECT 'Do Epic Shit', 'Ankur Warikoo', 299
WHERE (SELECT COUNT(*) FROM book) = 9;
