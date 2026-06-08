const express = require('express');
const router = express.Router();

const { Estudiante } = require('./database');

// ═══════════════════════════════════════════════
// CREATE
// POST /api/estudiantes
// ═══════════════════════════════════════════════
router.post('/', async (req, res) => {

  try {

    const nuevoEstudiante = new Estudiante(req.body);

    const guardado = await nuevoEstudiante.save();

    res.status(201).json({
      ok: true,
      mensaje: 'Estudiante registrado correctamente',
      datos: guardado
    });

  } catch (error) {

    res.status(400).json({
      ok: false,
      error: error.message
    });

  }

});

// ═══════════════════════════════════════════════
// READ ALL
// GET /api/estudiantes
// ═══════════════════════════════════════════════
router.get('/', async (req, res) => {

  try {

    const lista = await Estudiante.find()
      .sort({ nombre: 1 });

    res.json({
      ok: true,
      total: lista.length,
      datos: lista
    });

  } catch (error) {

    res.status(500).json({
      ok: false,
      error: error.message
    });

  }

});

// ═══════════════════════════════════════════════
// READ ONE
// GET /api/estudiantes/:id
// ═══════════════════════════════════════════════
router.get('/:id', async (req, res) => {

  try {

    const estudiante = await Estudiante.findById(req.params.id);

    if (!estudiante) {

      return res.status(404).json({
        ok: false,
        error: 'No encontrado'
      });

    }

    res.json({
      ok: true,
      datos: estudiante
    });

  } catch (error) {

    res.status(500).json({
      ok: false,
      error: error.message
    });

  }

});

// ═══════════════════════════════════════════════
// UPDATE
// PUT /api/estudiantes/:id
// ═══════════════════════════════════════════════
router.put('/:id', async (req, res) => {

  try {

    const actualizado = await Estudiante.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!actualizado) {

      return res.status(404).json({
        ok: false,
        error: 'No encontrado'
      });

    }

    res.json({
      ok: true,
      mensaje: 'Estudiante actualizado',
      datos: actualizado
    });

  } catch (error) {

    res.status(400).json({
      ok: false,
      error: error.message
    });

  }

});

// ═══════════════════════════════════════════════
// DELETE
// DELETE /api/estudiantes/:id
// ═══════════════════════════════════════════════
router.delete('/:id', async (req, res) => {

  try {

    const eliminado = await Estudiante.findByIdAndDelete(
      req.params.id
    );

    if (!eliminado) {

      return res.status(404).json({
        ok: false,
        error: 'No encontrado'
      });

    }

    res.json({
      ok: true,
      mensaje: `Estudiante ${eliminado.nombre} eliminado correctamente`
    });

  } catch (error) {

    res.status(500).json({
      ok: false,
      error: error.message
    });

  }

});

module.exports = router;