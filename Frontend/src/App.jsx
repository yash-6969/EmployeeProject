import React, { useState, useEffect, useMemo } from 'react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import toast, { Toaster } from 'react-hot-toast';
import ViewModal from './components/ViewModal';

const API_URL = 'http://localhost:5000/api/employees';
const initialFormData = {
  EMPLOYEE_ID: '', FIRST_NAME: '', LAST_NAME: '', EMAIL: '', PHONE_NUMBER: '',
  HIRE_DATE: '', JOB_ID: '', SALARY: '', COMMISSION_PCT: '', MANAGER_ID: '', DEPARTMENT_ID: ''
};

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [editingId, setEditingId] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  // --- State for Search and Sort ---
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'FIRST_NAME', direction: 'ascending' });

  // --- Fetch Users ---
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Could not fetch employees.');
    }
  };

  // --- Form Input Handler ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- Form Submit (Create/Update) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      // --- UPDATE (PUT) ---
      try {
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const updatedEmployee = await response.json();
        
        setUsers(users.map(user => 
          user.EMPLOYEE_ID === editingId ? { ...user, ...updatedEmployee } : user
        ));
        toast.success('Employee updated successfully!');
      } catch (error) {
        console.error('Error updating employee:', error);
        toast.error('Failed to update employee.');
      }
    } else {
      // --- CREATE (POST) ---
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const newEmployee = await response.json();
        
        setUsers([newEmployee, ...users]);
        toast.success('Employee added successfully!');
      } catch (error) {
        console.error('Error adding employee:', error);
        toast.error('Failed to add employee.');
      }
    }
    setFormData(initialFormData);
    setEditingId(null);
  };

  // --- Delete Handler ---
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });
        setUsers(users.filter(user => user.EMPLOYEE_ID !== id));
        toast.success('Employee deleted successfully!');
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Failed to delete employee.');
      }
    }
  };

  // --- Edit Handler ---
  const handleEdit = (user) => {
    const hireDate = user.HIRE_DATE ? new Date(user.HIRE_DATE).toISOString().split('T')[0] : '';
    setFormData({
      ...user,
      HIRE_DATE: hireDate,
      FIRST_NAME: user.FIRST_NAME || '',
      PHONE_NUMBER: user.PHONE_NUMBER || '',
      SALARY: user.SALARY || '',
      COMMISSION_PCT: user.COMMISSION_PCT || '',
      MANAGER_ID: user.MANAGER_ID || '',
      DEPARTMENT_ID: user.DEPARTMENT_ID || ''
    });
    setEditingId(user.EMPLOYEE_ID);
  };

  // --- Cancel Edit Handler ---
  const cancelEdit = () => {
    setFormData(initialFormData);
    setEditingId(null);
  };
  
  // --- View Handler ---
  const handleView = (user) => {
    setViewingUser(user);
  };

  // --- Sort Handler ---
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // --- Search and Sort Logic ---
  const processedUsers = useMemo(() => {
    let filterableUsers = [...users];

    // 1. Filtering
    if (searchTerm) {
      filterableUsers = filterableUsers.filter(user => {
        const term = searchTerm.toLowerCase();
        return (
          user.FIRST_NAME?.toLowerCase().includes(term) ||
          user.LAST_NAME?.toLowerCase().includes(term) ||
          user.EMAIL?.toLowerCase().includes(term) ||
          user.JOB_ID?.toLowerCase().includes(term) ||
          String(user.EMPLOYEE_ID).includes(term)
        );
      });
    }

    // 2. Sorting
    if (sortConfig.key) {
      filterableUsers.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filterableUsers;
  }, [users, searchTerm, sortConfig]);

  // --- JSX to Render ---
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <Toaster position="top-right" reverseOrder={false} />
      
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Employee Management
      </h1>
      
      <UserForm
        formData={formData}
        editingId={editingId}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onCancelEdit={cancelEdit}
      />

      <div className="my-6 border-t border-gray-200"></div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email, ID, or job..."
          className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* User List */}
      <UserList
        users={processedUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onSort={requestSort}
        sortConfig={sortConfig}
      />
      
      {/* View Modal */}
      {viewingUser && (
        <ViewModal
          user={viewingUser}
          onClose={() => setViewingUser(null)}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}

export default App;