-- Run in the SQLite CLI:  sqlite3 books.db < sql/schema_and_seed.sql
DROP TABLE IF EXISTS book;

CREATE TABLE book (
  id INTEGER PRIMARY KEY,
  title TEXT,
  author TEXT,
  price INTEGER,
  pages INTEGER
);

INSERT INTO book (title, author, price, pages) VALUES
  ('The Alchemist', 'Paulo Coelho', 299, 208),
  ('Wings of Fire', 'A. P. J. Abdul Kalam', 350, 180),
  ('The Guide', 'R. K. Narayan', 275, 220),
  ('Malgudi Days', 'R. K. Narayan', 250, 256),
  ('Godan', 'Munshi Premchand', 199, 336),
  ('The God of Small Things', 'Arundhati Roy', 399, 340),
  ('Train to Pakistan', 'Khushwant Singh', 225, 181),
  ('A Suitable Boy', 'Vikram Seth', 799, 1349),
  ('Midnight''s Children', 'Salman Rushdie', 450, 647),
  ('The White Tiger', 'Aravind Adiga', 320, 321);
