// ── routes/componentes.js ───────────────────────────────────
const express = require('express');
const router = express.Router();
const Componente = require('../models/Componente'); // Asegúrate que este archivo existe

// ── GET /api/componentes - Obtener todos ───────────────────
router.get('/', async (req, res) => {
    try {
        console.log('📥 GET /api/componentes');
        const componentes = await Componente.find().sort({ fechaRegistro: -1 });
        console.log(`✅ Encontrados ${componentes.length} componentes`);
        res.json(componentes);
    } catch (error) {
        console.error('❌ Error en GET /:', error);
        res.status(500).json({ error: error.message });
    }
});

// ── GET /api/componentes/:id - Obtener uno ─────────────────
router.get('/:id', async (req, res) => {
    try {
        console.log(`📥 GET /api/componentes/${req.params.id}`);
        const componente = await Componente.findById(req.params.id);
        if (!componente) {
            return res.status(404).json({ error: 'Componente no encontrado' });
        }
        res.json(componente);
    } catch (error) {
        console.error('❌ Error en GET /:id:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ error: 'ID inválido' });
        }
        res.status(500).json({ error: error.message });
    }
});

// ── POST /api/componentes - Crear uno ──────────────────────
router.post('/', async (req, res) => {
    try {
        console.log('📦 POST /api/componentes');
        console.log('📝 Datos recibidos:', req.body);
        
        const { nombre, marca, categoria, precio, stock, imagen } = req.body;
        
        // Validación manual
        const errores = {};
        if (!nombre) errores.nombre = 'El nombre es obligatorio';
        if (!marca) errores.marca = 'La marca es obligatoria';
        if (!categoria) errores.categoria = 'La categoría es obligatoria';
        if (precio === undefined || precio === '') errores.precio = 'El precio es obligatorio';
        if (stock === undefined || stock === '') errores.stock = 'El stock es obligatorio';
        if (!imagen) errores.imagen = 'La imagen es obligatoria';
        
        if (Object.keys(errores).length > 0) {
            return res.status(400).json({ 
                error: 'Datos inválidos',
                detalles: errores
            });
        }
        
        const componente = new Componente({
            nombre: nombre.trim(),
            marca: marca.trim(),
            categoria,
            precio: parseFloat(precio),
            stock: parseInt(stock),
            imagen: imagen.trim()
        });
        
        const nuevoComponente = await componente.save();
        console.log('✅ Componente creado:', nuevoComponente._id);
        res.status(201).json(nuevoComponente);
    } catch (error) {
        console.error('❌ Error en POST:', error);
        if (error.name === 'ValidationError') {
            const errores = {};
            Object.keys(error.errors).forEach(key => {
                errores[key] = error.errors[key].message;
            });
            return res.status(400).json({ 
                error: 'Error de validación',
                detalles: errores
            });
        }
        res.status(500).json({ error: error.message });
    }
});

// ── PUT /api/componentes/:id - Actualizar uno ──────────────
router.put('/:id', async (req, res) => {
    try {
        console.log(`✏️ PUT /api/componentes/${req.params.id}`);
        console.log('📝 Datos a actualizar:', req.body);
        
        const componenteActualizado = await Componente.findByIdAndUpdate(
            req.params.id,
            req.body,
            { 
                new: true,
                runValidators: true,
                context: 'query'
            }
        );
        
        if (!componenteActualizado) {
            return res.status(404).json({ error: 'Componente no encontrado' });
        }
        
        console.log('✅ Componente actualizado:', componenteActualizado._id);
        res.json(componenteActualizado);
    } catch (error) {
        console.error('❌ Error en PUT:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ error: 'ID inválido' });
        }
        if (error.name === 'ValidationError') {
            const errores = {};
            Object.keys(error.errors).forEach(key => {
                errores[key] = error.errors[key].message;
            });
            return res.status(400).json({ 
                error: 'Error de validación',
                detalles: errores
            });
        }
        res.status(500).json({ error: error.message });
    }
});

// ── DELETE /api/componentes/:id - Eliminar uno ─────────────
router.delete('/:id', async (req, res) => {
    try {
        console.log(`🗑️ DELETE /api/componentes/${req.params.id}`);
        
        const componenteEliminado = await Componente.findByIdAndDelete(req.params.id);
        
        if (!componenteEliminado) {
            return res.status(404).json({ error: 'Componente no encontrado' });
        }
        
        console.log('✅ Componente eliminado:', req.params.id);
        res.json({ 
            mensaje: 'Componente eliminado correctamente',
            id: req.params.id
        });
    } catch (error) {
        console.error('❌ Error en DELETE:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ error: 'ID inválido' });
        }
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;