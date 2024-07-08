import React from 'react';

const InputPers = ({ label, type, name, value, onChange }) => {
  return (
    <div className="col-sm-4">
      <label className="label-control">
        {label}
        <input 
          className="form-control" 
          type={type} 
          name={name} 
          value={value}
          onChange={onChange}
        />
      </label>
    </div>
  );
};


export default InputPers;
