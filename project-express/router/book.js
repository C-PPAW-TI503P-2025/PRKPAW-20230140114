import { Router } from "express";
import fs from "fs-extra";

const router = Router();

const DATA_FILE = "./books.json";
const readBooks = async () => await fs.readJson(DATA_FILE);
const writeBooks = async (data) => await fs.writeJson(DATA_FILE, data, { spaces: 2 });


router.get("/books", async (req, res, next) => {
  try {
    const books = await readBooks();
    res.json(books);
  } catch (err) {
    next(err);
  }
});

router.get("/books/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const books = await readBooks();
    const book = books.find((b) => b.id == id);
    if (!book) return res.status(404).json({ error: "Buku tidak ditemukan." });
    res.json(book);
  } catch (err) {
    next(err);
  }
});




router.post("/books", async (req, res, next) => {
  try {
    const { title, author, year } = req.body;
    if (!title || !author || !year) {
      return res.status(400).json({ error: "Semua field wajib diisi." });
    }

    const books = await readBooks();
    const newBook = {
      id: books.length ? books[books.length - 1].id + 1 : 1,
      title,
      author,
      year,
    };
    books.push(newBook);
    await writeBooks(books);

    res.status(201).json(newBook);
  } catch (err) {
    next(err);
  }
});


router.put("/books/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, author, year } = req.body;

    if (!title || !author || !year) {
      return res.status(400).json({ error: "Semua field wajib diisi." });
    }

    const books = await readBooks();
    const index = books.findIndex((b) => b.id == id);

    if (index === -1) return res.status(404).json({ error: "Buku tidak ditemukan." });

    books[index] = { id: Number(id), title, author, year };
    await writeBooks(books);
    res.json(books[index]);
  } catch (err) {
    next(err);
  }
});


router.delete("/books/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const books = await readBooks();
    const index = books.findIndex((b) => b.id == id);

    if (index === -1) return res.status(404).json({ error: "Buku tidak ditemukan." });

    const deleted = books.splice(index, 1);
    await writeBooks(books);
    res.json({ message: "Buku berhasil dihapus", deleted });
  } catch (err) {
    next(err);
  }
});
export default router;