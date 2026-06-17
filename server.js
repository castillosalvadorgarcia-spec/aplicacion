// ── server.js ─────────────────────────────────────────────────
// ── Cargar variables de entorno ──────────────────────────
require('dotenv').config();

// ── LOG DE DEPURACIÓN: Verificar variables de entorno ──
console.log('=================================');
console.log('🔍 DEPURACIÓN DE VARIABLES DE ENTORNO');
console.log('=================================');
console.log('📡 NODE_ENV:', process.env.NODE_ENV || 'no definido');
console.log('📡 PORT:', process.env.PORT || 'no definido');
console.log('📡 MONGODB_URI:', process.env.MONGODB_URI ? '✅ CONFIGURADA' : '❌ NO CONFIGURADA');
if (process.env.MONGODB_URI) {
    const uriPreview = process.env.MONGODB_URI.substring(0, 40) + '...';
    console.log(`📡 URI (inicio): ${uriPreview}`);
}
console.log('=================================');

// ── Importar librerías (SOLO UNA VEZ) ───────────────────
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// ── Importar módulos del proyecto (SOLO UNA VEZ) ───────
const { conectarDB } = require('./config/database');
const componenteRoutes = require('./routes/componentes');

// ── Crear aplicación ─────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ──────────────────────────────────────────
// CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parseo de JSON y URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── LOG de peticiones (solo en desarrollo) ──────────────
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`📥 ${req.method} ${req.url}`);
        if (['POST', 'PUT'].includes(req.method)) {
            console.log('📦 Body:', req.body);
        }
        next();
    });
}

// ── Archivos estáticos ──────────────────────────────────
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// ── Rutas de la API ─────────────────────────────────────
app.use('/api/componentes', componenteRoutes);

// ── Ruta principal ──────────────────────────────────────
app.get('/', (req, res) => {
    const indexPath = path.join(publicPath, 'index.html');
    
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).json({
            error: 'index.html no encontrado',
            message: `El archivo index.html debe estar en: ${indexPath}`
        });
    }
});

// ── Health Check ──────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        mongodb: 'Conectado'
    });
});

// ── Manejo de errores 404 ────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.url,
        method: req.method
    });
});

// ── Manejo de errores global ─────────────────────────────
app.use((err, req, res, next) => {
    console.error('❌ Error global:', err);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: err.message
    });
});

// ── Iniciar servidor ─────────────────────────────────────
async function iniciarServidor() {
    try {
        // Conectar a MongoDB
        await conectarDB();
        
        // Iniciar servidor HTTP
        app.listen(PORT, () => {
            console.log('=================================');
            console.log('💻 Catálogo de Componentes PC');
            console.log('=================================');
            console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
            console.log(`🌐 Accede en: http://localhost:${PORT}`);
            console.log(`📡 API en: http://localhost:${PORT}/api/componentes`);
            console.log(`🏥 Health: http://localhost:${PORT}/health`);
            console.log('=================================');
            console.log(`📂 Sirviendo desde: ${publicPath}`);
            
            // Verificar archivos estáticos
            const indexPath = path.join(publicPath, 'index.html');
            if (fs.existsSync(indexPath)) {
                console.log('✅ index.html encontrado');
            } else {
                console.warn('⚠️ index.html NO encontrado en public/');
            }
            console.log('=================================');
        });
        
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:');
        console.error('📝', error.message);
        process.exit(1);
    }
}

// ── Iniciar aplicación ──────────────────────────────────
iniciarServidor();