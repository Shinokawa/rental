import React, { useEffect, useState } from 'react';

const FeesPage = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFee, setNewFee] = useState({
    contract: '',
    category: 'rent',
    amount: '',
    term: '',
    is_collected: false,
    payment_method: ''
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/fees/', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      },
    })
      .then(response => response.json())
      .then(data => {
        setFees(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('获取费用数据失败：', error);
        setLoading(false);
      });
  }, []);

  const handleAddFee = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/fees/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        },
        body: JSON.stringify(newFee)
      });
      if (response.ok) {
        const data = await response.json();
        setFees([...fees, data]);
        setShowAddForm(false);
        setNewFee({contract:'',category:'rent',amount:'',term:'',is_collected:false,payment_method:''});
      }
    } catch (error) {
      console.error('添加费用失败:', error);
    }
  };

  const handleUpdateStatus = async (id, is_collected) => {
    try {
      const response = await fetch(`http://localhost:8000/api/fees/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        },
        body: JSON.stringify({ is_collected })
      });
      if (response.ok) {
        const data = await response.json();
        setFees(fees.map(fee => fee.id === id ? data : fee));
      }
    } catch (error) {
      console.error('更新状态失败:', error);
    }
  };

  if (loading) return <div>加载中...</div>;

  return (
    <div>
      <h2>费用管理</h2>
      <button onClick={() => setShowAddForm(!showAddForm)}>添加费用</button>
      
      {showAddForm && (
        <form onSubmit={handleAddFee}>
          <div>
            <label>合同ID:</label>
            <input
              type="text"
              value={newFee.contract}
              onChange={(e) => setNewFee({ ...newFee, contract: e.target.value })}
            />
          </div>
          <div>
            <label>费用类别:</label>
            <input
              type="text"
              value={newFee.category}
              onChange={(e) => setNewFee({ ...newFee, category: e.target.value })}
            />
          </div>
          <div>
            <label>金额:</label>
            <input
              type="number"
              value={newFee.amount}
              onChange={(e) => setNewFee({ ...newFee, amount: e.target.value })}
            />
          </div>
          <div>
            <label>所属期限:</label>
            <input
              type="text"
              value={newFee.term}
              onChange={(e) => setNewFee({ ...newFee, term: e.target.value })}
            />
          </div>
          <div>
            <label>是否收取:</label>
            <input
              type="checkbox"
              checked={newFee.is_collected}
              onChange={(e) => setNewFee({ ...newFee, is_collected: e.target.checked })}
            />
          </div>
          <div>
            <label>收款方式:</label>
            <input
              type="text"
              value={newFee.payment_method}
              onChange={(e) => setNewFee({ ...newFee, payment_method: e.target.value })}
            />
          </div>
          <button type="submit">提交</button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>合同ID</th>
            <th>费用类别</th>
            <th>金额</th>
            <th>所属期限</th>
            <th>是否收取</th>
            <th>逾期状态</th>
            <th>收款方式</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {fees.map(fee => (
            <tr key={fee.id}>
              <td>{fee.contract && fee.contract.id}</td>
              <td>{fee.category}</td>
              <td>{fee.amount}</td>
              <td>{fee.term}</td>
              <td>{fee.is_collected ? '已收' : '未收'}</td>
              <td>{fee.overdue_status}</td>
              <td>{fee.payment_method || '-'}</td>
              <td>
                <button onClick={() => handleUpdateStatus(fee.id, !fee.is_collected)}>
                  {fee.is_collected ? '标记未收' : '标记已收'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeesPage;