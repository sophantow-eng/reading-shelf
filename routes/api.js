// REST API ตอบกลับเป็น JSON — ใช้ทดสอบด้วย curl / Postman / fetch ได้
const express = require('express');
const Book = require('../models/book');
const { validate } = require('../lib/validate');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(Book.all({ q: String(req.query.q ?? '').trim() }));
});

router.get('/:id', (req, res) => {
  const book = Book.find(Number(req.params.id));
  if (!book) return res.status(404).json({ error: 'ไม่พบหนังสือ' });
  res.json(book);
});

router.post('/', (req, res) => {
  const { values, errors, ok } = validate(req.body);
  if (!ok) return res.status(400).json({ errors });
  res.status(201).json(Book.create(values));
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Book.find(id)) return res.status(404).json({ error: 'ไม่พบหนังสือ' });
  const { values, errors, ok } = validate(req.body);
  if (!ok) return res.status(400).json({ errors });
  res.json(Book.update(id, values));
});

router.delete('/:id', (req, res) => {
  const removed = Book.remove(Number(req.params.id));
  if (!removed) return res.status(404).json({ error: 'ไม่พบหนังสือ' });
  res.status(204).end();
});

module.exports = router;
