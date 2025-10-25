// App.jsx
// Import the hook from react-router-dom
import { useNavigate } from "react-router-dom"; 
import React, { useState, useEffect, useMemo } from "react";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";
import ViewModal from "./components/ViewModal";
import toast, { Toaster } from "react-hot-toast";

const API_URL = "http://localhost:5000/api/employees";

const initialFormData = {
  EMPLOYEE_ID: "",
  FIRST_NAME: "",
  LAST_NAME: "",
  EMAIL: "",
  PHONE_NUMBER: "",
  HIRE_DATE: "",
  JOB_ID: "",
  SALARY: "",
  COMMISSION_PCT: "",
  MANAGER_ID: "",
  DEPARTMENT_ID: "",
};

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [editingId, setEditingId] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "FIRST_NAME",
    direction: "ascending",
  });

  // ✅ Initialize the navigate function
  const navigate = useNavigate();

  // ✅ Fetch all employees
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Could not fetch employees.");
    }
  };

  // ✅ Input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Add or Update Employee
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      try {
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const updatedEmployee = await response.json();
        setUsers(
          users.map((user) =>
            user.EMPLOYEE_ID === editingId ? { ...user, ...updatedEmployee } : user
          )
        );
        toast.success("Employee updated successfully!");
      } catch (error) {
        console.error("Error updating employee:", error);
        toast.error("Failed to update employee.");
      }
    } else {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const newEmployee = await response.json();
        setUsers([newEmployee, ...users]);
        toast.success("Employee added successfully!");
      } catch (error) {
        console.error("Error adding employee:", error);
        toast.error("Failed to add employee.");
      }
    }

    setFormData(initialFormData);
    setEditingId(null);
  };

  // ✅ Delete Employee
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        setUsers(users.filter((user) => user.EMPLOYEE_ID !== id));
        toast.success("Employee deleted successfully!");
      } catch (error) {
        console.error("Error deleting employee:", error);
        toast.error("Failed to delete employee.");
      }
    }
  };

  // ✅ Edit Employee
  const handleEdit = (user) => {
    const hireDate = user.HIRE_DATE
      ? new Date(user.HIRE_DATE).toISOString().split("T")[0]
      : "";
    setFormData({
      ...user,
      HIRE_DATE: hireDate,
      FIRST_NAME: user.FIRST_NAME || "",
      PHONE_NUMBER: user.PHONE_NUMBER || "",
      SALARY: user.SALARY || "",
      COMMISSION_PCT: user.COMMISSION_PCT || "",
      MANAGER_ID: user.MANAGER_ID || "",
      DEPARTMENT_ID: user.DEPARTMENT_ID || "",
    });
    setEditingId(user.EMPLOYEE_ID);
  };

  const cancelEdit = () => {
    setFormData(initialFormData);
    setEditingId(null);
  };

  const handleView = (user) => {
    setViewingUser(user);
  };

  // ✅ Handle Logout - UPDATED
  const handleLogout = () => {
    // Implement your real auth logic here
    // e.g., clear a token from localStorage
    // localStorage.removeItem('userToken');
    
    console.log("Logout clicked!");
    toast.success("Logged out successfully!");
    
    // ✅ Use navigate to redirect
    navigate('/register'); // or '/register' or wherever you want to go
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // ✅ Filtering + Sorting
  const processedUsers = useMemo(() => {
    let filtered = [...users];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.FIRST_NAME?.toLowerCase().includes(term) ||
          u.LAST_NAME?.toLowerCase().includes(term) ||
          u.EMAIL?.toLowerCase().includes(term) ||
          u.JOB_ID?.toLowerCase().includes(term) ||
          String(u.EMPLOYEE_ID).includes(term)
      );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key] || "";
        const bVal = b[sortConfig.key] || "";
        if (
          ["SALARY", "EMPLOYEE_ID", "MANAGER_ID", "DEPARTMENT_ID"].includes(
            sortConfig.key
          )
        ) {
          const numA = parseFloat(aVal) || 0;
          const numB = parseFloat(bVal) || 0;
          return sortConfig.direction === "ascending"
            ? numA - numB
            : numB - numA;
        }
        return sortConfig.direction === "ascending"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
    }

    return filtered;
  }, [users, searchTerm, sortConfig]);

  // ✅ UI Rendering
  return (
    <div
      className="min-h-screen  flex flex-col items-center py-10"
      style={{
        background:
          "linear-gradient(180deg, #0f172a 0%, #1e293b 40%, #0b1220 100%)",
        fontFamily:
          'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      }}
    >
      <Toaster position="top-right" reverseOrder={false} />

      {/* --- Header with Title and Logout Button --- */}
      <div className="w-11/12 md:w-10/12 lg:w-8/12 flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide drop-shadow">
          Employee Management Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          Logout
        </button>
      </div>
      {/* --- End Header --- */}

      <div
        className="w-11/12 md:w-10/12 lg:w-8/12 rounded-2xl p-6 shadow-2xl"
        style={{
          backgroundColor: "rgba(255,255,255,0.96)",
          border: "1px solid rgba(15,23,42,0.06)",
        }}
      >
        <UserForm
          formData={formData}
          editingId={editingId}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancelEdit={cancelEdit}
        />

        <div className="my-6 border-t" style={{ borderColor: "#e2e8f0" }} />

        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search by name, email, ID, or job..."
            className="w-full p-3 rounded-lg shadow-sm"
            style={{
              border: "1px solid rgba(15,23,42,0.08)",
              background: "#f8fafc",
              color: "#0f172a",
            }}
          />
        </div>

        {/* ✅ Scrollable Employee List */}
        <div
          className="overflow-y-auto rounded-xl shadow-inner"
          style={{
            maxHeight: "450px",
            border: "1px solid rgba(15,23,42,0.1)",
            background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
          }}
        >
          <UserList
            users={processedUsers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onSort={requestSort}
            sortConfig={sortConfig}
          />
        </div>

        {viewingUser && (
          <ViewModal
            user={viewingUser}
            onClose={() => setViewingUser(null)}
            onEdit={handleEdit}
          />
        )}
      </div>

      <footer className="mt-6 text-sm text-gray-300">
        © {new Date().getFullYear()} HR Portal — All Rights Reserved
      </footer>
    </div>
  );
}

export default App;