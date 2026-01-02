import React, { useState } from 'react';
import { deleteUser, updateUser } from '../services/api';
import './UserList.css';

const UserList = ({ users, onRefresh }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState({});

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      setLoading({ ...loading, [id]: true });
      await deleteUser(id);
      onRefresh();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    } finally {
      setLoading({ ...loading, [id]: false });
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setEditData({ name: user.name, email: user.email });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSaveEdit = async (id) => {
    try {
      setLoading({ ...loading, [id]: true });
      await updateUser(id, editData);
      setEditingId(null);
      setEditData({});
      onRefresh();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    } finally {
      setLoading({ ...loading, [id]: false });
    }
  };

  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  if (users.length === 0) {
    return (
      <div className="user-list-container">
        <h2>Users</h2>
        <p>No users found. Create one above!</p>
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <h2>Users ({users.length})</h2>
      <div className="user-list">
        {users.map((user) => (
          <div key={user._id} className="user-card">
            {editingId === user._id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                  className="edit-input"
                />
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => handleEditChange('email', e.target.value)}
                  className="edit-input"
                />
                <div className="edit-actions">
                  <button
                    onClick={() => handleSaveEdit(user._id)}
                    disabled={loading[user._id]}
                    className="save-btn"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <small>
                    Created: {new Date(user.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <div className="user-actions">
                  <button
                    onClick={() => handleEdit(user)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    disabled={loading[user._id]}
                    className="delete-btn"
                  >
                    {loading[user._id] ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;

