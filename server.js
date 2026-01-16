const dotenv = require('dotenv');

// Environment variables yükle
dotenv.config();

const app = require('./app');
const { connectDB } = require('./config/db');

// Veritabanını başlat ve sunucuyu çalıştır
const startServer = async () => {
    await connectDB();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`\n🚀 Server ${process.env.NODE_ENV || 'development'} modunda çalışıyor`);
        console.log(`📡 API: http://localhost:${PORT}`);
        console.log(`\n📋 Endpoints:`);
        console.log(`   GET    http://localhost:${PORT}/api/patients`);
        console.log(`   GET    http://localhost:${PORT}/api/doctors`);
        console.log(`   GET    http://localhost:${PORT}/api/appointments\n`);
    });
};

startServer();
