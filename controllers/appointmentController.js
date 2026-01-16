const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// @desc    Tüm randevuları getir
// @route   GET /api/appointments
exports.getAppointments = async (req, res) => {
    try {
        const appointments = Appointment.findAll();
        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// @desc    Tek randevu getir
// @route   GET /api/appointments/:id
exports.getAppointment = async (req, res) => {
    try {
        const appointment = Appointment.findByPk(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Randevu bulunamadı'
            });
        }

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// @desc    Yeni randevu oluştur
// @route   POST /api/appointments
// @business_rule  Doktor aynı saatte birden fazla randevu alamaz
exports.createAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, appointmentDate, notes } = req.body;

        // Validasyon
        if (!patientId || !doctorId || !appointmentDate) {
            return res.status(400).json({
                success: false,
                message: 'Hasta, doktor ve randevu tarihi zorunludur'
            });
        }

        // Hasta kontrolü
        const patient = Patient.findByPk(patientId);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Hasta bulunamadı'
            });
        }

        // Doktor kontrolü
        const doctor = Doctor.findByPk(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doktor bulunamadı'
            });
        }

        // İŞ KURALI 2: Doktor aynı saatte birden fazla randevu alamaz
        const conflictingAppointment = Appointment.findConflicting(doctorId, appointmentDate);
        if (conflictingAppointment) {
            return res.status(400).json({
                success: false,
                message: 'Bu doktor seçilen tarih ve saatte başka bir randevuya sahip. Lütfen farklı bir zaman seçin.'
            });
        }

        const appointment = Appointment.create({
            patientId,
            doctorId,
            appointmentDate,
            notes
        });

        res.status(201).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// @desc    Randevu güncelle
// @route   PUT /api/appointments/:id
exports.updateAppointment = async (req, res) => {
    try {
        const appointment = Appointment.findByPk(req.params.id, false);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Randevu bulunamadı'
            });
        }

        // Eğer tarih değiştiriliyorsa çakışma kontrolü yap
        if (req.body.appointmentDate) {
            const doctorId = req.body.doctorId || appointment.doctorId;
            const conflictingAppointment = Appointment.findConflicting(
                doctorId,
                req.body.appointmentDate,
                req.params.id
            );

            if (conflictingAppointment) {
                return res.status(400).json({
                    success: false,
                    message: 'Bu doktor seçilen tarih ve saatte başka bir randevuya sahip.'
                });
            }
        }

        const updated = Appointment.update(req.params.id, req.body);

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

// @desc    Randevu sil
// @route   DELETE /api/appointments/:id
// @business_rule  Tarihi geçmiş randevular silinemez
exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = Appointment.findByPk(req.params.id, false);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Randevu bulunamadı'
            });
        }

        // İŞ KURALI 1: Tarihi geçmiş randevular silinemez
        const now = new Date();
        if (new Date(appointment.appointmentDate) < now) {
            return res.status(400).json({
                success: false,
                message: 'Tarihi geçmiş randevular silinemez. Bu randevu klinik kayıtları için korunmalıdır.'
            });
        }

        Appointment.delete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Randevu başarıyla silindi'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};
