import React from 'react';
import UserItem from './UserItem';

// --- MODIFIED: Accept onSort and sortConfig props ---
function UserList({ users, onEdit, onDelete, onView, onSort, sortConfig }) {

  // Helper function to render sort arrows
  const getSortArrow = (key) => {
    if (sortConfig.key !== key) return null;
    if (sortConfig.direction === 'ascending') return ' 🔼';
    return ' 🔽';
  };

  // Helper component for sortable headers
  const SortableHeader = ({ label, sortKey }) => (
    <th className="p-3 border-b-2 border-gray-200 font-semibold text-gray-600 uppercase tracking-wider">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="w-full text-left font-semibold uppercase"
      >
        {label}
        {getSortArrow(sortKey)}
      </button>
    </th>
  );

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Employee List</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-left">
          <thead>
            <tr className="bg-gray-100">
              {/* --- MODIFIED: Use SortableHeader component --- */}
              <SortableHeader label="ID" sortKey="EMPLOYEE_ID" />
              <SortableHeader label="Name" sortKey="FIRST_NAME" />
              <SortableHeader label="Email" sortKey="EMAIL" />
              <SortableHeader label="Job ID" sortKey="JOB_ID" />
              <SortableHeader label="Hire Date" sortKey="HIRE_DATE" />
              <th className="p-3 border-b-2 border-gray-200 font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Show a message if no users are found after filtering */}
            {users.length > 0 ? (
              users.map((user) => (
                <UserItem
                  key={user.EMPLOYEE_ID}
                  user={user}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UserList;