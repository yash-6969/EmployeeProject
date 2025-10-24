import React from 'react';

// A simple helper component to display each detail
const DetailItem = ({ label, value }) => (
  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-base text-gray-900 sm:mt-0 sm:col-span-2">
      {value || 'N/A'}
    </dd>
  </div>
);

function ViewModal({ user, onClose, onEdit }) {
  const hireDate = user.HIRE_DATE 
    ? new Date(user.HIRE_DATE).toLocaleDateString() 
    : 'N/A';

  // --- FIXED: Append a domain to the email for display ---
  const displayEmail = `${user.EMAIL}@company.com`;

  const handleEditClick = () => {
    onEdit(user);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-lg bg-white shadow-xl max-h-[90vh] flex flex-col"
      >
        {/* --- (No changes to Modal Header) --- */}
        <div className="flex items-start justify-between rounded-t border-b p-5">
          <h2 className="text-2xl font-semibold text-gray-900">
            Employee Details
          </h2>
          <button
            onClick={onClose}
            className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
          >
            {/* ... (svg icon) ... */}
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6">
          <dl>
            <DetailItem label="Employee ID" value={user.EMPLOYEE_ID} />
            <DetailItem label="First Name" value={user.FIRST_NAME} />
            <DetailItem label="Last Name" value={user.LAST_NAME} />
            {/* --- MODIFIED: Use the displayEmail variable --- */}
            <DetailItem label="Email" value={displayEmail} />
            <DetailItem label="Phone Number" value={user.PHONE_NUMBER} />
            <DetailItem label="Hire Date" value={hireDate} />
            <DetailItem label="Job ID" value={user.JOB_ID} />
            <DetailItem label="Salary" value={user.SALARY} />
            <DetailItem label="Commission %" value={user.COMMISSION_PCT} />
            <DetailItem label="Manager ID" value={user.MANAGER_ID} />
            <DetailItem label="Department ID" value={user.DEPARTMENT_ID} />
          </dl>
        </div>

        {/* --- (No changes to Modal Footer) --- */}
        <div className="flex items-center justify-end space-x-2 rounded-b border-t p-5">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:ring-4 focus:ring-blue-300"
          >
            Close
          </button>
          <button
            onClick={handleEditClick}
            className="rounded-lg bg-yellow-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewModal;