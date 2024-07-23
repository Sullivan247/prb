import React from 'react';
import buaGif from '../Bua.gif'; // Asegúrate de que esta ruta sea correcta

const Home = () => {
  return (
    <div className="container">
      <h1>Bienvenido a la aplicación de Contactos</h1>
      <p>Seleccione una opción del menú para comenzar.</p>
      <p>Esta aplicación permite crear, actualizar, visualizar y eliminar contactos fácilmente.</p>
      <img src={buaGif} alt="Gif" />
    </div>
  );
};

export default Home;
