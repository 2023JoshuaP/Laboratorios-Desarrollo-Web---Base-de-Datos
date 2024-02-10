import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  
  const [clientes, setCliente] = useState([]);  //mostrar tabla afencia
  const [personasFeme, setPersonasFeme] = useState([]);
  


  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:3001/', { withCredentials: true }) // Corregimos la URL para que coincida con el puerto del servidor
    .then(res => {
      if(res.data.Status === "Success"){
        setAuth(true);
        setName(res.data.name);
      } else{
        setAuth(false);
        setMessage(res.data.message);
      }
    })
    .catch(err => {
      console.error('Error en la solicitud:', err);
    });
  }, []);

  const handleLogout = () => {
    axios.get('http://localhost:3001/logout', { withCredentials: true }) // Corregimos la URL para que coincida con el puerto del servidor
      .then(res => {
        if(res.data.Status === "Success"){
          window.location.reload(true);
        } else{
          alert("error");
        }
      })
      .catch(err => console.log(err));
  }

  
  //MOSTRAR DATOS DE persona
  useEffect(() => {
    axios.get('http://localhost:3001/personas', { withCredentials: true })
      .then(res => {
        console.log(res.data); // Agrega esta línea para verificar la estructura de los datos recibidos
        if (res.data.length > 0) {
          setAuth(true);
          setName(res.data[0].name);
          setCliente(res.data); // Actualiza el estado de clientes con los datos recibidos
        } else {
          setAuth(false);
          setMessage("No hay usuarios autorizados disponibles.");
        }
      })
      .catch(err => {
        console.error('Error en la solicitud:', err);
      });
  }, []);


  //insertar

  const handleInsert = () => {
    const dni = document.getElementById('dni').value;
    const nombre = document.getElementById('nombre').value;
    const apell_pat = document.getElementById('apell_pat').value;
    const apell_mat = document.getElementById('apell_mat').value;
    const genero = document.getElementById('genero').value;
    const nacionalidad = document.getElementById('nacionalidad').value;
    const fecha_nac = document.getElementById('fecha_nac').value;
  
    axios.post('http://localhost:3001/insertar', {
      dni: dni,
      nombre: nombre,
      apell_pat: apell_pat,
      apell_mat: apell_mat,
      genero: genero,
      nacionalidad: nacionalidad,
      fecha_nac: fecha_nac
    }, { withCredentials: true })
    .then(res => {
      console.log(res.data);
      if (res.data.status === 'Success') {
        alert('Registro exitoso');
      }
    })
    .catch(err => console.error('Error en la solicitud:', err));
  }

  // reporte
  
  const visualizarGenero = () => {
    axios.get('http://localhost:3001/mostrarGenero', { withCredentials: true })
      .then(res => {
        setPersonasFeme(res.data);
      })
      .catch(err => {
        console.error('Error en la solicitud:', err);
      });
  };
  
  
  return (
    <div className='container mt-4'>
      {
        auth ?
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Administrador autorizado</h3>
            </div>
            <div>
              <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
            </div>
          </div>
          <div style={{ display: 'flex', marginTop: '5px', position: 'relative' }}>
            <div style={{ width: '30%' }}>
              <input type="text" className='form-control' id="dni" placeholder="dni" style={{ marginBottom: '5px' }} /><br/>
              <input type="text" className='form-control' id="nombre" placeholder="nombre" style={{ marginBottom: '5px' }} /><br/>
              <input type="text" className='form-control' id="apell_pat" placeholder="apell_pat" style={{ marginBottom: '5px' }} /><br/>
              <input type="text" className='form-control' id="apell_mat" placeholder="apell_mat" style={{ marginBottom: '5px' }} /><br/>
              <input type="text" className='form-control' id="genero" placeholder="genero" style={{ marginBottom: '5px' }} /><br/>
              <input type="text" className='form-control' id="nacionalidad" placeholder="nacionalidad" style={{ marginBottom: '5px' }} /><br/>
              <input type="text" className='form-control' id="fecha_nac" placeholder="fecha_nac" style={{ marginBottom: '5px' }} /><br/>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button className='btn btn-success' id="insertar" onClick={handleInsert}>Insertar</button>
                <button className='btn btn-primary' id="reporte" onClick={visualizarGenero}>Reporte</button>
              </div>
              <br></br>
              <h1 style={{ textAlign: 'center' }}>Reporte</h1>
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th scope="col">DNI</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellido Paterno</th>
                    <th scope="col">Apellido Materno</th>
                    <th scope="col">Genero</th>
                    <th scope="col">Nacionalidad</th>
                    <th scope="col">Fecha de Nacimiento</th>
                  </tr>
                </thead>
                <tbody>
                  {personasFeme.map(persona => (
                    <tr key={persona.DNI}>
                      <td>{persona.DNI}</td>
                      <td>{persona.nombre}</td>
                      <td>{persona.apell_pat}</td>
                      <td>{persona.apell_mat}</td>
                      <td>{persona.genero}</td>
                      <td>{persona.nacionalidad}</td>
                      <td>{persona.fecha_nac}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ width: '50%', position: 'absolute', top: 0, right: 0 }}> {/* Posicionamiento absoluto */}
              <h1 style={{ textAlign: 'center' }}>Tabla Persona</h1>
              <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">DNI</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellido Paterno</th>
                    <th scope="col">Apellido Materno</th>
                    <th scope="col">Genero</th>
                    <th scope="col">Nacionalidad</th>
                    {/*<th scope="col">Fecha de Nacimiento</th>*/}
                  </tr>
                </thead>
                <tbody>
                  {clientes.map(persona => (
                    <tr key={persona.DNI}>
                      <td>{persona.DNI}</td>
                      <td>{persona.nombre}</td>
                      <td>{persona.apell_pat}</td>
                      <td>{persona.apell_mat}</td>
                      <td>{persona.genero}</td>
                      <td>{persona.nacionalidad}</td>
                      {/*<td>{persona.fecha_nac}</td>*/}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        :
        <div>
          <h3>{message}</h3>
          <h3>Login now</h3>
          <Link to="/login" className='btn btn-primary'>Login</Link>
        </div>
      }
    </div>
  )
}  


export default Home;