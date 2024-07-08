import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InputPers from './componentes/inputs.js';
import DynamicSelect from './componentes/selects.js';
import DynamicButton from './componentes/botones.js';
import optionsData from './DatosComunas.json';
import axios from 'axios';

const App = () => {
  const initialFormData = {
    rut: '',
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    celular: '',
    direccion: '',
    comuna: '' // Agregamos comuna al estado
  };

  const [addFormData, setAddFormData] = useState(initialFormData);
  const [updateFormData, setUpdateFormData] = useState(initialFormData);

  const handleInputChange = (e, setFormData) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSave = (formData, setFormData) => {
    const storedData = JSON.parse(localStorage.getItem('userList')) || [];
    const newUser = { id: storedData.length + 1, ...formData };
    storedData.push(newUser);
    localStorage.setItem('userList', JSON.stringify(storedData));
    alert('Datos guardados exitosamente');
    setFormData(initialFormData); // Limpiar formulario después de guardar
  };

  const handleClear = (setFormData) => {
    setFormData(initialFormData);
  };

  const handleFetchRandomUser = async (setFormData) => {
    try {
      const response = await axios.get('https://randomuser.me/api/');
      const user = response.data.results[0];
      const randomUserData = {
        rut: user.login.uuid,
        nombre: user.name.first,
        apellido: user.name.last,
        correo: user.email,
        telefono: user.phone,
        celular: user.cell,
        direccion: `${user.location.street.number} ${user.location.street.name}`,
        comuna: '' // Puedes asignar un valor predeterminado o dejarlo vacío
      };
      setFormData(randomUserData);
    } catch (error) {
      console.error('Error fetching random user:', error);
      alert('Error al obtener usuario aleatorio');
    }
  };

  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <Link className="navbar-brand" to="/prb/">Contactos</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/prb/tabla">Tabla</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/prb/agregar">Agregar</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/prb/actualizar">Actualizar</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/prb/eliminar">Eliminar</Link>
              </li>
            </ul>
          </div>
        </nav>
        <div className="tab-content mt-3">
          <Routes>
            <Route path="/prb/" element={<Principal />} />
            <Route path="/prb/tabla" element={<Tabla />} />
            <Route path="/prb/agregar" element={
              <AgregarUsuario 
                formData={addFormData} 
                handleInputChange={(e) => handleInputChange(e, setAddFormData)} 
                handleSave={() => handleSave(addFormData, setAddFormData)} 
                handleClear={() => handleClear(setAddFormData)} 
                handleFetchRandomUser={() => handleFetchRandomUser(setAddFormData)}
              />} 
            />
            <Route path="/prb/actualizar" element={
              <Actualizar 
                formData={updateFormData} 
                setFormData={setUpdateFormData} 
                handleInputChange={(e) => handleInputChange(e, setUpdateFormData)} 
                initialFormData={initialFormData} 
                handleSave={() => handleSave(updateFormData, setUpdateFormData)} 
              />} 
            />
            <Route path="/prb/eliminar" element={<Eliminar />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const Principal = () => {
  return (
    <div>
    <h1>hoal</h1>
    </div
  );
}

const Tabla = () => {
  const [userList, setUserList] = useState([]);
  const [comunas, setComunas] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userList')) || [];
    setUserList(storedData);
    setComunas(optionsData);
  }, []);

  const getComunaNombre = (comunaValue) => {
    const comuna = comunas.find(c => c.value === parseInt(comunaValue, 10));
    return comuna ? comuna.nombre : '';
  };

  return (
    <div className="container" id="Modulo1">
      <div className="row">
        <div className="card w-100">
          <div className="card-body">
             <h3>Tabla</h3>
              <hr/>
            <div className="row mb-4">
              <div className="col-sm-4">
                <label htmlFor="TipoBusqueda" className="form-label">Buscar Usuario</label>
                <DynamicSelect selectType="usuarios" />
              </div>
              <div className="col-sm-4">
                <label htmlFor="exampleFormControlInput1" className="form-label">Buscar Usuario</label>
                <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="" />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <table className="table table-striped table-bordered">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Apellido</th>
                      <th scope="col">Correo Electrónico</th>
                      <th scope="col">Teléfono</th>
                      <th scope="col">Celular</th>
                      <th scope="col">Dirección</th>
                      <th scope="col">Comuna</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((user, index) => (
                      <tr key={index}>
                        <th scope="row">{user.id}</th>
                        <td>{user.nombre}</td>
                        <td>{user.apellido}</td>
                        <td>{user.correo}</td>
                        <td>{user.telefono}</td>
                        <td>{user.celular}</td>
                        <td>{user.direccion}</td>
                        <td>{getComunaNombre(user.comuna)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AgregarUsuario = ({ formData, handleInputChange, handleSave, handleClear, handleFetchRandomUser }) => (
  <div className="container" id="Modulo1">
    <div className="row">
      <div className="card w-100">
        <div className="card-body">
          <div className="row">
            <h3>Agregar Usuario</h3>
            <hr/>
            <InputPers 
              label="RUT" 
              type="text" 
              name="rut" 
              value={formData.rut} 
              onChange={handleInputChange} 
            />
            <InputPers 
              label="Nombre" 
              type="text" 
              name="nombre" 
              value={formData.nombre} 
              onChange={handleInputChange} 
            />
            <InputPers 
              label="Apellido" 
              type="text" 
              name="apellido" 
              value={formData.apellido} 
              onChange={handleInputChange} 
            />
            <InputPers 
              label="Correo" 
              type="text" 
              name="correo" 
              value={formData.correo} 
              onChange={handleInputChange} 
            />
            <InputPers 
              label="Telefono" 
              type="text" 
              name="telefono" 
              value={formData.telefono} 
              onChange={handleInputChange} 
            />
            <InputPers 
              label="Celular" 
              type="text" 
              name="celular" 
              value={formData.celular} 
              onChange={handleInputChange} 
            />
            <InputPers 
              label="Direccion" 
              type="text" 
              name="direccion" 
              value={formData.direccion} 
              onChange={handleInputChange} 
            />
            <div className="col-sm-4">
              <label htmlFor="TipoBusqueda" className="form-label">Comuna</label>
              <DynamicSelect selectType="comunas" onChange={handleInputChange} name="comuna" value={formData.comuna}/>
            </div>
          </div>
          <div className='row espaciadoTop'>
            <div className="col-sm-2">
              <DynamicButton
                className="btn btn-success"
                onClick={handleSave}
                label="Confirmar"
              />
            </div>
            <div className="col-sm-2">
              <DynamicButton
                className="btn btn-danger"
                onClick={handleClear}
                label="Limpiar"
              />
            </div>
            <div className="col-sm-2">
              <DynamicButton
                className="btn btn-info"
                onClick={handleFetchRandomUser}
                label="Usuario Aleatorio"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Actualizar = ({ formData, setFormData, handleInputChange, initialFormData, handleSave }) => {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userList')) || [];
    setUserList(storedData);
  }, []);

  const handleUserSelect = (e) => {
    const userId = parseInt(e.target.value, 10);
    const selectedUser = userList.find(user => user.id === userId);
    if (selectedUser) {
      setFormData(selectedUser);
    }
  };

  const handleUpdate = () => {
    const updatedList = userList.map(user => 
      user.id === formData.id ? formData : user
    );
    setUserList(updatedList);
    localStorage.setItem('userList', JSON.stringify(updatedList));
    alert('Usuario actualizado exitosamente');
  };

  return (
    <div className="container" id="Modulo3">
      <div className="row">
        <div className="card w-100">
          <div className="card-body">
            <div className="row">
              <h3>Actualizar Usuario</h3>
              <hr />
              <div className='col-sm-4'>
                <label htmlFor="Usuarios" className="form-label">Usuarios</label>
                <DynamicSelect selectType="usuarios" onChange={handleUserSelect} name="Usuarios" />
              </div>
            </div>
            <hr />
            <div className='row'>
              <InputPers
                label="RUT"
                type="text"
                name="rut"
                value={formData.rut}
                onChange={handleInputChange}
              />
              <InputPers
                label="Nombre"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
              />
              <InputPers
                label="Apellido"
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
              />
              <InputPers
                label="Correo"
                type="text"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
              />
              <InputPers
                label="Telefono"
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
              />
              <InputPers
                label="Celular"
                type="text"
                name="celular"
                value={formData.celular}
                onChange={handleInputChange}
              />
              <InputPers
                label="Direccion"
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
              />
              <div className="col-sm-4">
                <label htmlFor="TipoBusqueda" className="form-label">Comuna</label>
                <DynamicSelect selectType="comunas" onChange={handleInputChange} name="comuna" value={formData.comuna} />
              </div>
              <div className='row espaciadoTop'>
                <div className="col-sm-2">
                  <DynamicButton
                    className="btn btn-success"
                    onClick={handleUpdate}
                    label="Actualizar"
                  />
                </div>
                <div className="col-sm-2">
                  <DynamicButton
                    className="btn btn-danger"
                    onClick={() => setFormData(initialFormData)}
                    label="Limpiar"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Eliminar = () => {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userList')) || [];
    setUserList(storedData);
  }, []);

  const handleDelete = (id) => {
    const updatedList = userList.filter(user => user.id !== id);
    setUserList(updatedList);
    localStorage.setItem('userList', JSON.stringify(updatedList));
    alert('Usuario eliminado exitosamente');
  };

  return (
    <div className="container" id="Modulo4">
      <div className="row">
        <div className="card w-100">
          <div className="card-body">
            <div className="row">
              <h3>Eliminar usuarios</h3>
              <hr />
              <div className='col-sm-12'>
                <ul>
                  {userList.map((user, index) => (
                    <li key={index}>
                      <div className='row'>
                        <div className='col-sm-2'>
                          {user.id}
                        </div>
                        <div className='col-sm-8'>
                        {user.nombre} {user.apellido}
                        </div>
                        <div className='col-sm-2'>
                          <DynamicButton
                            className="btn btn-danger"
                            onClick={() => handleDelete(user.id)}
                            label="Eliminar"
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
