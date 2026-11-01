// เชื่อมต่อฐานข้อมูล SQLite และสร้างตารางถ้ายังไม่มี
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const file = process.env.DB_PATH || path.join(__dirname, 'data', 'books.db');
fs.mkdirSync(path.dirname(file), { recursive: true });

const db = new Database(file);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL,
    author     TEXT    NOT NULL DEFAULT '',
    status     TEXT    NOT NULL DEFAULT 'want'
               CHECK (status IN ('want', 'reading', 'done')),
    pages      INTEGER,
    rating     INTEGER NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
    note       TEXT    NOT NULL DEFAULT '',
    created_at TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
  )
`);

module.exports = db;
