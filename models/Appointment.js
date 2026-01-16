const { readDB, writeDB, generateId } = require('../config/db');
const Patient = require('./Patient');
const Doctor = require('./Doctor');

class Appointment {
    static findAll(includeRelations = true) {
        const db = readDB();
        if (!includeRelations) return db.appointments;

        return db.appointments.map(apt => ({
            ...apt,
            patient: Patient.findByPk(apt.patientId),
            doctor: Doctor.findByPk(apt.doctorId)
        }));
    }

    static findByPk(id, includeRelations = true) {
        const db = readDB();
        const appointment = db.appointments.find(a => a.id === id);
        if (!appointment) return null;

        if (includeRelations) {
            return {
                ...appointment,
                patient: Patient.findByPk(appointment.patientId),
                doctor: Doctor.findByPk(appointment.doctorId)
            };
        }
        return appointment;
    }

    static findConflicting(doctorId, appointmentDate, excludeId = null) {
        const db = readDB();
        const targetTime = new Date(appointmentDate).getTime();

        return db.appointments.find(a =>
            a.doctorId === doctorId &&
            new Date(a.appointmentDate).getTime() === targetTime &&
            a.status !== 'cancelled' &&
            a.id !== excludeId
        );
    }

    static create(data) {
        const db = readDB();
        const appointment = {
            id: generateId(),
            patientId: data.patientId,
            doctorId: data.doctorId,
            appointmentDate: data.appointmentDate,
            status: data.status || 'scheduled',
            notes: data.notes || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        db.appointments.push(appointment);
        writeDB(db);

        return {
            ...appointment,
            patient: Patient.findByPk(appointment.patientId),
            doctor: Doctor.findByPk(appointment.doctorId)
        };
    }

    static update(id, data) {
        const db = readDB();
        const index = db.appointments.findIndex(a => a.id === id);
        if (index === -1) return null;

        db.appointments[index] = {
            ...db.appointments[index],
            ...data,
            updatedAt: new Date().toISOString()
        };
        writeDB(db);

        const updated = db.appointments[index];
        return {
            ...updated,
            patient: Patient.findByPk(updated.patientId),
            doctor: Doctor.findByPk(updated.doctorId)
        };
    }

    static delete(id) {
        const db = readDB();
        const index = db.appointments.findIndex(a => a.id === id);
        if (index === -1) return false;

        db.appointments.splice(index, 1);
        writeDB(db);
        return true;
    }
}

module.exports = Appointment;
