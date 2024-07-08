import React, { useEffect, useState } from 'react';
import optionsData from '../DatosComunas.json'; // Ajusta la ruta según sea necesario

const DynamicSelect = ({ selectType, onChange, name, value }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (selectType === 'usuarios') {
      const storedData = JSON.parse(localStorage.getItem('userList')) || [];
      setOptions(storedData.map(user => ({ value: user.id, nombre: `${user.id} - ${user.nombre} ${user.apellido}` })));
    } else if (selectType === 'comunas') {
      setOptions(optionsData);
    }
  }, [selectType]);

  return (
    <select className="form-control" name={name} value={value} onChange={onChange}>
      <option value="">Seleccione...</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.nombre}
        </option>
      ))}
    </select>
  );
};

export default DynamicSelect;
