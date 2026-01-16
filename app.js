const express = require('express');
const errorHandler = require('./middlewares/errorHandler');

// Route dosyalarını import et
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ana sayfa
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Klinik Randevu Yönetim Sistemi API',
        version: '1.0.0',
        endpoints: {
            patients: '/api/patients',
            doctors: '/api/doctors',
            appointments: '/api/appointments'
        }
    });
});

// Route'ları bağla
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint bulunamadı'
    });
});

// Error handler middleware
app.use(errorHandler);

module.exports = app;
