import { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import EditStudent from './EditStudent'; // Chúng ta sẽ tạo file này sau

function Home() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [stuClass, setStuClass] = useState("");
  
  // Bài 5: Tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  
  // Bài 6: Sắp xếp
  const [sortAsc, setSortAsc] = useState(true); 

  // Bài 1: Lấy danh sách học sinh
  useEffect(() => {
    axios.get('http://localhost:5000/api/students')
      .then(response => setStudents(response.data))
      .catch(error => console.error("Lỗi fetch:", error));
  }, []); 

  // Bài 2: Thêm học sinh
  const handleAddStudent = (e) => {
    e.preventDefault();
    const newStu = { name, age: Number(age), class: stuClass };
    axios.post('http://localhost:5000/api/students', newStu)
      .then(res => {
        setStudents(prev => [...prev, res.data]); // Cập nhật state 
        setName(""); setAge(""); setStuClass(""); // Xóa form 
      })
      .catch(err => console.error(err));
  };

  // Bài 4: Xóa học sinh
  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return; // 
    axios.delete(`http://localhost:5000/api/students/${id}`)
      .then(res => {
        setStudents(prev => prev.filter(s => s._id !== id)); // 
      })
      .catch(err => console.error(err));
  };

  // Xử lý Tìm kiếm & Sắp xếp (Client-side)
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  ); // 

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (a.name < b.name) return sortAsc ? -1 : 1;
    if (a.name > b.name) return sortAsc ? 1 : -1;
    return 0;
  }); // 

  return (
    <div style={{ padding: 20 }}>
      <h1>Quản Lý Học Sinh</h1>
      
      {/* Form Thêm - Bài 2 */}
      <h3>Thêm Học Sinh</h3>
      <form onSubmit={handleAddStudent}>
        <input placeholder="Tên" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Tuổi" type="number" value={age} onChange={e => setAge(e.target.value)} required />
        <input placeholder="Lớp" value={stuClass} onChange={e => setStuClass(e.target.value)} required />
        <button type="submit">Thêm</button>
      </form>
      
      <hr />

      {/* Tìm kiếm & Sắp xếp - Bài 5, 6 */}
      <div style={{ margin: '10px 0' }}>
        <input 
          type="text" 
          placeholder="Tìm kiếm theo tên..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
        /> 
        <button onClick={() => setSortAsc(!sortAsc)} style={{ marginLeft: 10 }}>
          Sắp xếp: {sortAsc ? 'A → Z' : 'Z → A'}
        </button>
      </div>

      {/* Danh sách hiển thị - Bài 1 */}
      <table border="1" cellPadding="10" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Tên</th><th>Tuổi</th><th>Lớp</th><th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map(s => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.age}</td>
              <td>{s.class}</td>
              <td>
                {/* Nút Sửa chuyển trang - Bài 3 */}
                <Link to={`/edit/${s._id}`}><button>Sửa</button></Link>
                {/* Nút Xóa - Bài 4 */}
                <button onClick={() => handleDelete(s._id)} style={{ marginLeft: 5 }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Cấu hình Route chính
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/edit/:id" element={<EditStudent />} />
    </Routes>
  ); 
}

export default App;