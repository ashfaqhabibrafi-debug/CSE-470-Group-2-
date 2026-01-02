import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, updateUser } from '../../services/userApi';
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
  });

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const query = filter === 'all' ? {} : { role: filter };
      const response = await getUsers(query);
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteUser(userId);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role || '',
      phone: user.phone || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({
      name: '',
      email: '',
      role: '',
      phone: '',
    });
  };

  const handleSaveEdit = async (userId) => {
    try {
      await updateUser(userId, editForm);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user');
      console.error('Error updating user:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value,
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return '#d32f2f';
      case 'volunteer':
        return '#1976d2';
      case 'citizen':
        return '#388e3c';
      default:
        return '#666';
    }
  };

  if (loading) {
    return (
      <div className="manage-users-container">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="manage-users-container">
      <div className="page-header">
        <h1>Manage Users</h1>
        <p>View, edit, and manage all system users</p>
      </div>

      <div className="filter-tabs">
        <button
          className={`tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Users
        </button>
        <button
          className={`tab ${filter === 'citizen' ? 'active' : ''}`}
          onClick={() => setFilter('citizen')}
        >
          Citizens
        </button>
        <button
          className={`tab ${filter === 'volunteer' ? 'active' : ''}`}
          onClick={() => setFilter('volunteer')}
        >
          Volunteers
        </button>
        <button
          className={`tab ${filter === 'admin' ? 'active' : ''}`}
          onClick={() => setFilter('admin')}
        >
          Admins
        </button>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <p>No users found.</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  {editingUser === user._id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleInputChange}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleInputChange}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <select
                          name="role"
                          value={editForm.role}
                          onChange={handleInputChange}
                          className="edit-select"
                        >
                          <option value="citizen">Citizen</option>
                          <option value="volunteer">Volunteer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          name="phone"
                          value={editForm.phone}
                          onChange={handleInputChange}
                          className="edit-input"
                        />
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleSaveEdit(user._id)}
                            className="btn-save"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="btn-cancel"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className="role-badge"
                          style={{ backgroundColor: getRoleColor(user.role) }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>{user.phone || '—'}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEdit(user)}
                            className="btn-edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user._id, user.name)}
                            className="btn-delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;

