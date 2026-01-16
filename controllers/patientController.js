const Patient = require('../models/Patient');

// @desc    Tüm hastaları getir
// @route   GET /api/patients
exports.getPatients = async (req, res) => {
    try {
        const patients = Patient.findAll();
        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// @desc    Tek hasta getir
// @route   GET /api/patients/:id
exports.getPatient = async (req, res) => {
    try {
        const patient = Patient.findByPk(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Hasta bulunamadı'
            });
        }

        res.status(200).json({
            success: true,
            data: patient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// @desc    Yeni hasta oluştur
// @route   POST /api/patients
exports.createPatient = async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        // Validasyon
        if (!name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Ad, email ve telefon zorunludur'
            });
        }

        // Email kontrolü
        const existingPatient = Patient.findByEmail(email);
        if (existingPatient) {
            return res.status(400).json({
                success: false,
                message: 'Bu email adresi zaten kayıtlı'
            });
        }

        const patient = Patient.create(req.body);
        res.status(201).json({
            success: true,
            data: patient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// @desc    Hasta güncelle
// @route   PUT /api/patients/:id
exports.updatePatient = async (req, res) => {
    try {
        const patient = Patient.findByPk(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Hasta bulunamadı'
            });
        }

        const updated = Patient.update(req.params.id, req.body);

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

// @desc    Hasta sil
// @route   DELETE /api/patients/:id
exports.deletePatient = async (req, res) => {
    try {
        const patient = Patient.findByPk(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Hasta bulunamadı'
            });
        }

        Patient.delete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Hasta başarıyla silindi'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};
