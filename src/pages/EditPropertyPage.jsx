import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState({
    house_number: '',
    area: '',
    address: '',
    rental_status: 'available',
    maintenance_status: '',
    current_value: '',
  });

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/api/properties/${id}/`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
      })
        .then(res => res.json())
        .then(data => setProperty(data));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = id 
      ? `http://localhost:8000/api/properties/${id}/`
      : 'http://localhost:8000/api/properties/';
    const method = id ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        },
        body: JSON.stringify(property)
      });
      navigate('/properties');
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  return (
    <div>
      <h2>{id ? '编辑房源' : '新增房源'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>房号:</label>
          <input
            value={property.house_number}
            onChange={e => setProperty({...property, house_number: e.target.value})}
            required
          />
        </div>
        <div>
          <label>面积:</label>
          <input
            type="number"
            value={property.area}
            onChange={e => setProperty({...property, area: e.target.value})}
            required
          />
        </div>
        <div>
          <label>地址:</label>
          <input
            value={property.address}
            onChange={e => setProperty({...property, address: e.target.value})}
            required
          />
        </div>
        <div>
          <label>租赁状态:</label>
          <select 
            value={property.rental_status}
            onChange={e => setProperty({...property, rental_status: e.target.value})}
          >
            <option value="available">未租赁</option>
            <option value="rented">已租赁</option>
            <option value="maintenance">维护中</option>
          </select>
        </div>
        <div>
          <label>维护状态:</label>
          <textarea
            value={property.maintenance_status}
            onChange={e => setProperty({...property, maintenance_status: e.target.value})}
          />
        </div>
        <div>
          <label>当前价值:</label>
          <input
            type="number"
            value={property.current_value}
            onChange={e => setProperty({...property, current_value: e.target.value})}
            required
          />
        </div>
        <button type="submit">保存</button>
        <button type="button" onClick={() => navigate('/properties')}>取消</button>
      </form>
    </div>
  );
};

export default EditPropertyPage;
