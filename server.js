const express = require("express");
const cors = require("cors");
const database = require("better-sqlite3");

const app = express();
app.use(express.static(__dirname));
app.use(cors());
app.use(express.json());

const db = new database("pesanan.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS pesanan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    email TEXT,
    alamat TEXT NOT NULL
  )
`);

app.post("/pesan", (req, res) => {
  const { nama, whatsapp, email, alamat } = req.body;
  if (!nama || !whatsapp || !email || !alamat) {
    return res
      .status(400)
      .json({ error: "Nama, Whatsapp, Email, dan alamat harus diisi" });
  }
  const stmt = db.prepare(
    "INSERT INTO pesanan (nama, whatsapp, email, alamat) VALUES (?, ?, ?, ?)",
  );
  const info = stmt.run(nama, whatsapp, email, alamat);
  res.json({ id: info.lastInsertRowid });
});

app.listen(3000, () => console.log("Server berjalan di http://localhost:3000"));
