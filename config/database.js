// ── config/database.js ──────────────────────────────────────
const mongoose = require('mongoose');

// ✅ ELIMINAR el fallback a localhost
// Si no existe MONGODB_URI, la aplicación debe fallar EXPLÍCITAMENTE
const MONGO_URI = process.env.MONGODB_URI;

async function conectarDB() {
    try {
        // ✅ Verificar que la URI existe
        if (!MONGO_URI) {
            throw new Error('❌ MONGODB_URI no está definida en las variables de entorno');
        }
        
        console.log('🔄 Conectando a MongoDB Atlas...');
        console.log(`📡 URI: ${MONGO_URI.replace(/\/\/.*@/, '//****:****@')}`); // Oculta la contraseña en logs
        
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB Atlas conectado correctamente');
        console.log(`📦 Base de datos: ${mongoose.connection.db.databaseName}`);
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error.message);
        // ✅ Salir con código de error para que Render lo detecte
        process.exit(1);
    }
}

// ── Eventos de conexión ────────────────────────────────────
mongoose.connection.on('connected', () => {
    console.log('📡 Conexión establecida con MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Error en la conexión MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ Desconectado de MongoDB');
});

// ── Cerrar conexión al terminar ───────────────────────────
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🛑 Conexión a MongoDB cerrada');
    process.exit(0);
});

async function conectarDB() {
    try {
        console.log('🔄 Conectando a MongoDB...');
        console.log('🔍 MONGODB_URI existe?', !!process.env.MONGODB_URI);
        console.log('🔍 URI:', process.env.MONGODB_URI ? '✅ Configurada' : '❌ NO CONFIGURADA');
        
        // ✅ Si quieres ver la URI (ocultando la contraseña)
        if (process.env.MONGODB_URI) {
            const uriParts = process.env.MONGODB_URI.split('@');
            const maskedURI = uriParts.length > 1 
                ? `${uriParts[0].replace(/\/\/.*:/, '//****:****@')}${uriParts[1]}`
                : 'URI no válida';
            console.log('🔍 URI (oculta):', maskedURI);
        }
        
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB conectado correctamente');
        console.log(`📦 Base de datos: ${mongoose.connection.db.databaseName}`);
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
}

module.exports = {
    conectarDB,
    mongoose
};
