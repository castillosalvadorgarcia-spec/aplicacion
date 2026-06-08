// ── Importamos las librerías instaladas ──────────────────
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const database = require('./database');
const routes = require('./routes');

// ── Crear la aplicación Express ───────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// ── Rutas API ─────────────────────────────────────────────
app.use('/api/estudiantes', routes);

// ── Ruta principal ────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Conexión MongoDB e inicio del servidor ────────────────
database.conectar()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en puerto ${PORT}`);
      console.log('📦 MongoDB conectado correctamente');
    });
  })
  .catch(err => {
    console.error('❌ Error de conexión:', err.message);
    process.exit(1);
  });