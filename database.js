const mongoose = require('mongoose');

// ── URL de conexión local ─────────────────────────────────
// mongodb://localhost:27017  ←  servidor MongoDB local
// /gestion_estudiantes       ←  nombre de la base de datos (se crea automático)
const MONGO_URI = 'mongodb://localhost:27017/gestion_estudiantes';

// ── Función para conectar ─────────────────────────────────
async function conectar() {
  await mongoose.connect(MONGO_URI);
}

// ── SCHEMA: Define la estructura de cada estudiante ───────
const estudianteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true                // Elimina espacios al inicio/final
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    trim: true
  },
  matricula: {
    type: String,
    required: [true, 'La matrícula es obligatoria'],
    unique: true,              // No puede haber dos iguales
    uppercase: true            // Guarda siempre en mayúsculas
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    lowercase: true,           // Guarda en minúsculas
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']  // Validación
  },
  carrera: {
    type: String,
    required: [true, 'La carrera es obligatoria']
  },
  semestre: {
    type: Number,
    min: 1, max: 10,
    required: true
  },
  fechaRegistro: {
    type: Date,
    default: Date.now          // Se pone automáticamente
  }
});

// ── Crear el MODELO a partir del Schema ───────────────────
// 'Estudiante' → nombre del modelo (mongoose crea la colección 'estudiantes')
const Estudiante = mongoose.model('Estudiante', estudianteSchema);

module.exports = { conectar, Estudiante };