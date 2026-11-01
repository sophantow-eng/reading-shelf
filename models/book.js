// ทุกอย่างที่คุยกับตาราง books อยู่ที่นี่ที่เดียว
const db = require('../db');

function all({ q } = {}) {
  let sql = 'SELECT * FROM books';
  const args = [];
  if (q) {
    sql += ' WHERE title LIKE ? OR author LIKE ?';
    args.push(`%${q}%`, `%${q}%`);
  }
  sql += ' ORDER BY updated_at DESC, id DESC';
  return db.prepare(sql).all(...args);
}

function find(id) {
  return db.prepare('SELECT * FROM books WHERE id = ?').get(id);
}

function create(v) {
  const info = db
    .prepare(
      `INSERT INTO books (title, author, status, pages, rating, note)
       VALUES (@title, @author, @status, @pages, @rating, @note)`
    )
    .run(v);
  return find(info.lastInsertRowid);
}

function update(id, v) {
  db.prepare(
    `UPDATE books
        SET title = @title, author = @author, status = @status,
            pages = @pages, rating = @rating, note = @note,
            updated_at = datetime('now')
      WHERE id = @id`
  ).run({ ...v, id });
  return find(id);
}

function remove(id) {
  return db.prepare('DELETE FROM books WHERE id = ?').run(id).changes > 0;
}

function count() {
  return db.prepare('SELECT COUNT(*) AS n FROM books').get().n;
}

module.exports = { all, find, create, update, remove, count };
