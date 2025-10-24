import React from 'react';

function UserItem({ user, onEdit, onDelete, onView }) {
  
  const actionButton = "py-1 px-3 rounded-md text-white text-sm font-medium transition-colors duration-200";
  const viewButton = `${actionButton} bg-gray-500 hover:bg-gray-600`;
  const editButton = `${actionButton} bg-yellow-500 hover:bg-yellow-600`;
  const deleteButton = `${actionButton} bg-red-600 hover:bg-red-700`;

  const hireDate = user.HIRE_DATE ? new Date(user.HIRE_DATE).toLocaleDateString() : 'N/A';

  // --- FIXED: Append a domain to the email for display ---
  const displayEmail = `${user.EMAIL}`;

  return (
    <tr className="hover:bg-gray-50">
      <td className="p-3 border-b border-gray-200 font-mono">{user.EMPLOYEE_ID}</td>
      <td className="p-3 border-b border-gray-200">{`${user.FIRST_NAME || ''} ${user.LAST_NAME}`}</td>
      {/* --- MODIFIED: Use the displayEmail variable --- */}
      <td className="p-3 border-b border-gray-200">{displayEmail}</td>
      <td className="p-3 border-b border-gray-200">{user.JOB_ID}</td>
      <td className="p-3 border-b border-gray-200">{hireDate}</td>
      
      <td className="p-3 border-b border-gray-200">
        <div className="flex gap-2"> 
          <button onClick={() => onView(user)} className={viewButton}>View</button>
          <button onClick={() => onEdit(user)} className={editButton}>Edit</button>
          <button onClick={() => onDelete(user.EMPLOYEE_ID)} className={deleteButton}>Delete</button>
        </div>
      </td>
    </tr>
  );
}

export default UserItem;