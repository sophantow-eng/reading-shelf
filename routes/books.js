// เส้นทางของหน้าเว็บ (ตอบกลับเป็น HTML ที่เรนเดอร์ด้วย EJS)
const express = require('express');
const Book = require('../models/book');
const { validate, STATUSES } = require('../lib/validate');

const router = express.Router();
const blank = { title: '', author: '', status: 'want', pages: null, rating: 0, note: '' };

router.get('/', (req, res) => {
  const q = String(req.query.q ?? '').trim();
  const books = Book.all({ q });
  const shelves = Object.entries(STATUSES).map(([key, label]) => ({
    key,
    label,
    books: books.filter((b) => b.status === key),
  }));
  res.render('index', { title: 'ชั้นหนังสือ', shelves, q, total: books.length });
});

router.get('/books/new', (req, res) => {
  res.render('form', {
    title: 'เพิ่มหนังสือ',
    heading: 'เพิ่มหนังสือเล่มใหม่',
    action: '/books',
    book: blank,
    errors: {},
  });
});

router.post('/books', (req, res) => {
  const { values, errors, ok } = validate(req.body);
  if (!ok) {
    return res.status(400).render('form', {
      title: 'เพิ่มหนังสือ',
      heading: 'เพิ่มหนังสือเล่มใหม่',
      action: '/books',
      book: values,
      errors,
    });
  }
  Book.create(values);
  res.redirect('/');
});

// middleware: โหลดหนังสือตาม :id ถ้าไม่เจอให้ตอบ 404
function loadBook(req, res, next) {
  const id = Number(req.params.id);
  const book = Number.isInteger(id) ? Book.find(id) : null;
  if (!book) return res.status(404).render('404', { title: 'ไม่พบหนังสือ' });
  req.book = book;
  next();
}

router.get('/books/:id/edit', loadBook, (req, res) => {
  res.render('form', {
    title: 'แก้ไขหนังสือ',
    heading: 'แก้ไขหนังสือ',
    action: `/books/${req.book.id}?_method=PUT`,
    book: req.book,
    errors: {},
  });
});

router.put('/books/:id', loadBook, (req, res) => {
  const { values, errors, ok } = validate(req.body);
  if (!ok) {
    return res.status(400).render('form', {
      title: 'แก้ไขหนังสือ',
      heading: 'แก้ไขหนังสือ',
      action: `/books/${req.book.id}?_method=PUT`,
      book: { ...values, id: req.book.id },
      errors,
    });
  }
  Book.update(req.book.id, values);
  res.redirect('/');
});

router.delete('/books/:id', loadBook, (req, res) => {
  Book.remove(req.book.id);
  res.redirect('/');
});

module.exports = router;
