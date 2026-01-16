const Doctor = require('../models/Doctor');

// @desc    Tüm doktorları getir
// @route   GET /api/doctors
exports.getDoctors = async (req, res) => {
    try {
        const doctors = Doctor.findAll();
        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// @desc    Tek doktor getir
// @route   GET /api/doctors/:id
exports.getDoctor = async (req, res) => {
    try {
        const doctor = Doctor.findByPk(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doktor bulunamadı'
            });
        }

        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// @desc    Yeni doktor oluştur
// @route   POST /api/doctors
exports.createDoctor = async (req, res) => {
    try {
        const { name, email, specialization } = req.body;

        // Validasyon
        if (!name || !email || !specialization) {
            return res.status(400).json({
                success: false,
                message: 'Ad, email ve uzmanlık alanı zorunludur'
            });
        }

        // Email kontrolü
        const existingDoctor = Doctor.findByEmail(email);
        if (existingDoctor) {
            return res.status(400).json({
                success: false,
                message: 'Bu email adresi zaten kayıtlı'
            });
        }

        const doctor = Doctor.create(req.body);
        res.status(201).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// @desc    Doktor güncelle
// @route   PUT /api/doctors/:id
exports.updateDoctor = async (req, res) => {
    try {
        const doctor = Doctor.findByPk(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doktor bulunamadı'
            });
        }

        const updated = Doctor.update(req.params.id, req.body);

        res.status(200).json({
            success: true,
            data: updated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// @desc    Doktor sil
// @route   DELETE /api/doctors/:id
exports.deleteDoctor = async (req, res) => {
    try {
        const doctor = Doctor.findByPk(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doktor bulunamadı'
            });
        }

        Doctor.delete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Doktor başarıyla silindi'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};
