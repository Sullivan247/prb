import React from 'react';

const DynamicButton = ({ label, className, onClick }) => {
  return (
    <button 
      className={`btn btn-${className}`} 
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default DynamicButton;
