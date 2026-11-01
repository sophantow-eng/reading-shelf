const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

const booksRouter = require('./routes/books');
const apiRouter = require('./routes/api');
const helpers = require('./lib/helpers');
const { STATUSES } = require('./lib/validate');

const app = express();

// Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.locals = { ...app.locals, ...helpers, STATUSES };

// Middleware
app.disable('x-powered-by');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method')); // ให้ฟอร์ม HTML ใช้ PUT/DELETE ผ่าน ?_method=
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/health', (req, res) => res.send('ok')); // ให้ Cloud ตรวจว่าเซิร์ฟเวอร์ยังทำงาน
app.use('/api/books', apiRouter);
app.use('/', booksRouter);

// 404 และ error handler ต้องอยู่ท้ายสุด
app.use((req, res) => res.status(404).render('404', { title: 'ไม่พบหน้านี้' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', { title: 'เกิดข้อผิดพลาด' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`เปิดที่ http://localhost:${PORT}`));
