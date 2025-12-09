import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditStudent() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [student, setStudent] = useState({ name: '', age: '', class: '' });

  // Lấy thông tin hiện tại của học sinh
  useEffect(() => {
    axios.get(`http://localhost:5000/api/students/${id}`)
      .then(res => {
        setStudent({
          name: res.data.name,
          age: res.data.age,
          class: res.data.class
        }); 
      })
      .catch(err => console.error(err));
  }, [id]);

  // Gửi cập nhật
  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/students/${id}`, student)
      .then(() => {
        console.log("Đã cập nhật");
        navigate("/"); // Quay về trang chủ 
      })
      .catch(err => console.error(err));
  }; 

  return (
    <div style={{ padding: 20 }}>
      <h2>Chỉnh Sửa Học Sinh</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Tên: </label>
          <input 
            value={student.name} 
            onChange={e => setStudent({...student, name: e.target.value})} 
          />
        </div>
        <div>
          <label>Tuổi: </label>
          <input 
            type="number"
            value={student.age} 
            onChange={e => setStudent({...student, age: Number(e.target.value)})} 
          />
        </div>
        <div>
          <label>Lớp: </label>
          <input 
            value={student.class} 
            onChange={e => setStudent({...student, class: e.target.value})} 
          />
        </div>
        <button type="submit">Lưu thay đổi</button>
      </form>
    </div>
  );
}

export default EditStudent;