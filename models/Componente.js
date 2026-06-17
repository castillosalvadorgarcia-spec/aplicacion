// ── models/Componente.js ────────────────────────────────────
const mongoose = require('mongoose');

const componenteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    marca: {
        type: String,
        required: [true, 'La marca es obligatoria'],
        trim: true
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        enum: ['CPU', 'GPU', 'RAM', 'SSD', 'HDD', 'Motherboard', 'Fuente de Poder', 'Gabinete']
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    },
    stock: {
        type: Number,
        required: [true, 'El stock es obligatorio'],
        min: [0, 'El stock no puede ser negativo']
    },
    imagen: {
        type: String,
        required: [true, 'La imagen es obligatoria']
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    }
});

const Componente = mongoose.model('Componente', componenteSchema);

module.exports = Componente;