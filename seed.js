// npm run seed — ใส่หนังสือตัวอย่างถ้าตารางยังว่าง
const Book = require('./models/book');

if (Book.count() > 0) {
  console.log('มีข้อมูลอยู่แล้ว ข้ามการ seed');
} else {
  [
    { title: 'Clean Code', author: 'Robert C. Martin', status: 'reading', pages: 464, rating: 0, note: 'อ่านถึงบทที่ 3 เรื่องฟังก์ชัน' },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', status: 'want', pages: 352, rating: 0, note: '' },
    { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', status: 'done', pages: 472, rating: 5, note: 'บท Higher-order functions ช่วยได้มาก' },
    { title: 'You Don\'t Know JS Yet', author: 'Kyle Simpson', status: 'done', pages: 143, rating: 4, note: '' },
    { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', status: 'want', pages: 616, rating: 0, note: '' },
  ].forEach(Book.create);
  console.log('เพิ่มหนังสือตัวอย่างแล้ว');
}
