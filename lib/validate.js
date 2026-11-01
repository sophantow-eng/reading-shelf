// ตรวจและทำความสะอาดข้อมูลจากฟอร์ม/API ก่อนลงฐานข้อมูล
const STATUSES = {
  reading: 'กำลังอ่าน',
  want: 'อยากอ่าน',
  done: 'อ่านจบแล้ว',
};

function validate(body = {}) {
  const empty = (x) => x === undefined || x === null || x === '';

  const values = {
    title: String(body.title ?? '').trim(),
    author: String(body.author ?? '').trim(),
    status: String(body.status ?? 'want'),
    pages: empty(body.pages) ? null : Number(body.pages),
    rating: empty(body.rating) ? 0 : Number(body.rating),
    note: String(body.note ?? '').trim(),
  };

  const errors = {};
  if (!values.title) errors.title = 'กรอกชื่อหนังสือ';
  else if (values.title.length > 150) errors.title = 'ชื่อหนังสือยาวไม่เกิน 150 ตัวอักษร';

  if (values.author.length > 100) errors.author = 'ชื่อผู้เขียนยาวไม่เกิน 100 ตัวอักษร';

  if (!Object.hasOwn(STATUSES, values.status)) errors.status = 'เลือกสถานะจากรายการ';

  if (values.pages !== null && (!Number.isInteger(values.pages) || values.pages < 1 || values.pages > 5000))
    errors.pages = 'จำนวนหน้าต้องเป็นจำนวนเต็ม 1–5000';

  if (!Number.isInteger(values.rating) || values.rating < 0 || values.rating > 5)
    errors.rating = 'คะแนนต้องอยู่ระหว่าง 0–5';

  if (values.note.length > 1000) errors.note = 'บันทึกยาวไม่เกิน 1,000 ตัวอักษร';

  return { values, errors, ok: Object.keys(errors).length === 0 };
}

module.exports = { validate, STATUSES };
