const express = require('express');
const cors = require('cors');
const sql = require('mssql/msnodesqlv8');

const app = express();

app.use(cors());
app.use(express.json());

const dbConfig = {
  connectionString:
    'Driver={ODBC Driver 18 for SQL Server};Server=DESKTOP-BGDURJ4\\SQLEXPRESS;Database=BD_BRYALE;Trusted_Connection=Yes;TrustServerCertificate=Yes;'
};

// Ruta principal
app.get('/', (req, res) => {
  res.send('API BRYALE funcionando correctamente');
});

// Obtener usuarios
app.get('/usuarios', async (req, res) => {
  try {

    const pool = await sql.connect(dbConfig);

    const resultado = await pool
      .request()
      .query('SELECT * FROM usuarios');

    res.json(resultado.recordset);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      mensaje: 'Error al conectar con la base de datos',
      error: error.message
    });

  }
});

// LOGIN
app.post('/login', async (req, res) => {

  const { usuario, clave } = req.body;

  try {

    const pool = await sql.connect(dbConfig);

    const resultado = await pool
      .request()
      .input('usuario', sql.VarChar, usuario)
      .input('clave', sql.VarChar, clave)
      .query(`
        SELECT *
        FROM usuarios
        WHERE usuario = @usuario
        AND clave = @clave
      `);

    if (resultado.recordset.length > 0) {

      res.json({
        ok: true,
        usuario: resultado.recordset[0]
      });

    } else {

      res.json({
        ok: false,
        mensaje: 'Usuario o contraseña incorrectos'
      });

    }

  } catch (error) {

    console.log(error);

    res.status(500).json({
      ok: false,
      mensaje: 'Error del servidor',
      error: error.message
    });

  }

});

app.listen(3000, () => {
  console.log('Servidor API corriendo en http://localhost:3000');
});