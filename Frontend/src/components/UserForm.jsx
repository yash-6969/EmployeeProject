import React from 'react';

// --- (No changes to button styles) ---
const baseButton = "py-2 px-4 rounded-md font-semibold text-white transition-colors duration-200";
const submitButton = `${baseButton} bg-blue-600 hover:bg-blue-700`;
const cancelButton = `${baseButton} bg-gray-500 hover:bg-gray-600`;
const editButton = `${baseButton} bg-yellow-500 hover:bg-yellow-600`;

const inputStyle = "w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500";
const disabledInputStyle = `${inputStyle} bg-gray-100 cursor-not-allowed`;

// --- MOVED ---
// Define FormField *outside* (above) the UserForm component.
// Now it's a stable component and won't be re-created on every render.
const FormField = ({ label, name, value, onChange, type = "text", required = false, disabled = false, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && ' *'}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={disabled ? disabledInputStyle : inputStyle}
      {...props}
    />
  </div>
);

// --- UserForm component ---
function UserForm({ formData, editingId, onInputChange, onSubmit, onCancelEdit }) {
  
  return (
    <form onSubmit={onSubmit} className="p-6 bg-gray-50 rounded-lg border border-gray-200 mb-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        {editingId ? 'Edit Employee' : 'Add New Employee'}
      </h2>
      
      {/* This grid layout no longer re-creates FormField on every render.
        It just updates the props of the existing FormField components.
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="Employee ID" name="EMPLOYEE_ID" value={formData.EMPLOYEE_ID} onChange={onInputChange} type="number" required disabled={!!editingId} />
        <FormField label="First Name" name="FIRST_NAME" value={formData.FIRST_NAME} onChange={onInputChange} />
        <FormField label="Last Name" name="LAST_NAME" value={formData.LAST_NAME} onChange={onInputChange} required />
        
        <FormField label="Email" name="EMAIL" value={formData.EMAIL} onChange={onInputChange} type="email" required />
        <FormField label="Phone Number" name="PHONE_NUMBER" value={formData.PHONE_NUMBER} onChange={onInputChange} type="tel" />
        <FormField label="Hire Date" name="HIRE_DATE" value={formData.HIRE_DATE} onChange={onInputChange} type="date" required />
        
        <FormField label="Job ID" name="JOB_ID" value={formData.JOB_ID} onChange={onInputChange} required />
        <FormField label="Salary" name="SALARY" value={formData.SALARY} onChange={onInputChange} type="number" step="0.01" />
        <FormField label="Commission %" name="COMMISSION_PCT" value={formData.COMMISSION_PCT} onChange={onInputChange} type="number" step="0.01" min="0" max="1" />
        
        <FormField label="Manager ID" name="MANAGER_ID" value={formData.MANAGER_ID} onChange={onInputChange} type="number" />
        <FormField label="Department ID" name="DEPARTMENT_ID" value={formData.DEPARTMENT_ID} onChange={onInputChange} type="number" />
      </div>
      
      <div className="mt-6">
        <button type="submit" className={editingId ? editButton : submitButton}>
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button type="button" onClick={onCancelEdit} className={`${cancelButton} ml-2`}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default UserForm;