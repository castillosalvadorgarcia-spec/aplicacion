// ── config/database.js ──────────────────────────────────────
const mongoose = require('mongoose');

// ✅ SOLO usar variable de entorno - SIN fallback
const MONGO_URI = process.env.MONGODB_URI;

async function conectarDB() {
    try {
        // ✅ Verificar que la URI existe
        if (!MONGO_URI) {
            console.error('❌ ERROR CRÍTICO: MONGODB_URI no está definida');
            console.error('📝 Asegúrate de configurar la variable en Render');
            console.error('📝 URI esperada: mongodb+srv://usuario:contraseña@cluster.mongodb.net/');
            process.exit(1);
        }

        console.log('🔄 Conectando a MongoDB Atlas...');
        console.log(`📡 URI configurada: ${MONGO_URI.substring(0, 30)}...`);
        
        await mongoose.connect(MONGO_URI);
        
        console.log('✅ MongoDB Atlas conectado correctamente');
        console.log(`📦 Base de datos: ${mongoose.connection.db.databaseName}`);
        
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:');
        console.error('📝', error.message);
        
        if (error.message.includes('Authentication failed')) {
            console.error('💡 Solución: Verifica usuario y contraseña en la URI');
        } else if (error.message.includes('ENOTFOUND')) {
            console.error('💡 Solución: Verifica que el cluster de MongoDB esté activo');
        }
        
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

module.exports = {
    conectarDB,
    mongoose
};