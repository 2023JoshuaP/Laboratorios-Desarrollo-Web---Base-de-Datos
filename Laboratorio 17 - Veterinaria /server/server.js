const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET"],
    credentials: true
}));

const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "19032004",
    database : "veterinariadata"
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.json({message : "we need token plese provide it. "})
    } else{
        jwt.verify(token, "our.jsonwebtoken-secret-key", (err, decoded) => {
            if(err){
                return res.json({message : "Authentication erro"})
            } else{
                req.name = decoded.name;
                next();
            }
        })
    }
}

app.get('/', verifyUser, (req, res) => {
    return res.json({Status : "Success", name : req.name})
})

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, data) => {
        if (err) {
            console.error('Error en la consulta SQL:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        if (data.length > 0) {
            const name = data[0].name;
            const token = jwt.sign({ name }, "our.jsonwebtoken-secret-key", { expiresIn: '1d' });
            res.cookie('token', token);
            return res.json({ status: 'Success', token });
        } else {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    });
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión establecida con la base de datos');
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status : "Success"})
})

//insertar personas

app.post('/insertar', verifyUser, (req, res) => {
    const { dni, nombre, apell_pat, apell_mat, direccion, genero, nacionalidad, fecha_nac } = req.body;
    const sql = "INSERT INTO persona (dni, nombre, apell_pat, apell_mat, direccion, genero, nacionalidad, edad) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [dni, nombre, apell_pat, apell_mat, direccion, genero, nacionalidad, fecha_nac], (err, result) => {
        if (err) {
            console.error('Error en la consulta SQL:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        console.log('Datos insertados correctamente en la tabla persona');
        return res.json({ status: 'Success', message: 'Datos insertados correctamente' });
    });
});

// tabla de personas

app.get('/personas', verifyUser, (req, res) => {
    const sql = "SELECT * FROM persona";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error en la consulta SQL:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        return res.json(data);
    });
});

// reporte 

app.get('/mostrarDNIpar', verifyUser, (req, res) => {
    const sql = "CALL ObtenerDNIpares()";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error en la consulta SQL:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        return res.json(data[0]);
    });
});
 
app.listen(3001, () => {
    console.log("Escuchando en el puerto 3001");
});