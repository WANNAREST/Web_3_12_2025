const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Student = require('./student'); // Import model
const app = express();
app.use(cors());
app.use(express.json()); // Thay thế body-parser để parse JSON [cite: 29]
// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/student_db')
    .then(() => console.log("Đã kết nối MongoDB thành công"))
    .catch(err => console.error("Lỗi kết nối MongoDB:", err));

// --- CÁC ROUTE API SẼ VIẾT Ở ĐÂY ---
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// -- Bài 1 : Lấy danh sách-- 
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// -- Bài 2 : Thêm học sinh --
app.post('/api/students', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});
// -- Bài 3 : Sửa học sinh -- 
app.put('/api/students/:id', async (req, res) => {
    try {
        const updatedStu = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Trả về dữ liệu mới sau khi update
        );
        if (!updatedStu) return res.status(404).json({ error: "Student not found" });
        res.json(updatedStu);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Bài 4 : Xóa học sinh --
app.delete('/api/students/:id', async (req, res) => {
    try {
        const deleted = await Student.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Student not found" });
        res.json({ message: "Đã xóa học sinh", id: deleted._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 