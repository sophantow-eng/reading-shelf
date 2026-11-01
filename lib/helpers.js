// ฟังก์ชันช่วยที่เรียกใช้ได้ในไฟล์ EJS ทุกไฟล์ (ผ่าน app.locals)
const COLORS = ['#1F6F78', '#8A5A00', '#7A3E65', '#3E5C9A', '#4F6B2A', '#A6432F'];

module.exports = {
  // ความสูงสันหนังสือขึ้นกับจำนวนหน้า: 150–260px
  spineHeight(pages) {
    const p = pages || 200;
    return Math.round(Math.min(260, Math.max(150, 130 + p / 4)));
  },
  spineColor(id) {
    return COLORS[id % COLORS.length];
  },
};
