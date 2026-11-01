# สมุดอ่าน (Reading Shelf)

เว็บแอปจัดชั้นหนังสือส่วนตัว สร้างด้วย Node.js + Express + EJS + SQLite
เพิ่ม / ค้นหา / แก้ไข / ลบหนังสือ พร้อม REST API

## เริ่มใช้งาน

```bash
npm install
npm run seed     # (ไม่บังคับ) ใส่หนังสือตัวอย่าง
npm run dev      # เปิด http://localhost:3000
```

ต้องใช้ Node.js 18 ขึ้นไป

## โครงสร้างโปรเจ็ก

```
server.js          จุดเริ่มต้น: ตั้งค่า Express, middleware, routes
db.js              เชื่อมต่อ SQLite + สร้างตาราง
models/book.js     ฟังก์ชันคุยกับฐานข้อมูล (CRUD)
lib/validate.js    ตรวจข้อมูลก่อนบันทึก
routes/books.js    เส้นทางหน้าเว็บ (HTML)
routes/api.js      เส้นทาง API (JSON)
views/             เทมเพลต EJS
public/style.css   สไตล์
```

## เส้นทาง

| Method | Path | ทำอะไร |
|---|---|---|
| GET | `/` | หน้าชั้นหนังสือ (`?q=` ค้นหา) |
| GET | `/books/new` | ฟอร์มเพิ่มหนังสือ |
| POST | `/books` | บันทึกหนังสือใหม่ |
| GET | `/books/:id/edit` | ฟอร์มแก้ไข |
| PUT | `/books/:id` | บันทึกการแก้ไข |
| DELETE | `/books/:id` | ลบ |
| GET/POST/PUT/DELETE | `/api/books[/:id]` | REST API (JSON) |
| GET | `/health` | ตรวจสถานะเซิร์ฟเวอร์ |

ลองเรียก API:

```bash
curl http://localhost:3000/api/books
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Node.js in Action","author":"Mike Cantelon","status":"want"}'
```

## Deploy บน Render

1. push โค้ดขึ้น GitHub (`.gitignore` กัน `node_modules` และไฟล์ฐานข้อมูลไว้แล้ว)
2. ที่ render.com เลือก **New → Web Service** แล้วเชื่อม repo
3. ตั้งค่า
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Health Check Path: `/health`
4. กด Deploy แล้วจะได้ URL สาธารณะ

**ข้อควรรู้เรื่องข้อมูล:** ดิสก์ของ Render แบบฟรีไม่ถาวร ข้อมูล SQLite จะหายเมื่อ redeploy
ทางแก้: เพิ่ม Persistent Disk (แบบเสียเงิน) แล้วตั้ง env `DB_PATH=/var/data/books.db`
หรือย้ายไปใช้ PostgreSQL ที่ Render/Supabase ให้ ซึ่งเป็นแบบฝึกหัดต่อยอดที่ดี

## แนวคิดที่ใช้ (ตรงกับหัวข้อคอร์ส)

- **Node.js/Express:** `server.js` ตั้งค่าแอปและ middleware
- **Routing:** `routes/` แยกหน้าเว็บกับ API, ใช้ `express.Router`
- **EJS:** `views/` ใช้ partials (`head`, `foot`) และวนลูปแสดงข้อมูล
- **ฐานข้อมูล:** SQLite ผ่าน `better-sqlite3` ใช้ prepared statements กัน SQL injection
- **Deploy:** อ่านค่าพอร์ตจาก `process.env.PORT`, มี `/health`
- **Best practices:** แยก model / validation / routes, ตรวจข้อมูลฝั่งเซิร์ฟเวอร์, EJS escape ข้อมูลให้อัตโนมัติ

## ไอเดียต่อยอด

- ระบบล็อกอิน (express-session) ให้แต่ละคนมีชั้นของตัวเอง
- อัปโหลดหน้าปก, แท็ก/หมวดหมู่, เรียงลำดับ
- ย้ายไป PostgreSQL
