const { readDB, writeDB, generateId } = require('../config/db');

class Doctor {
    static findAll() {
        const db = readDB();
        return db.doctors;
    }

    static findByPk(id) {
        const db = readDB();
        return db.doctors.find(d => d.id === id) || null;
    }

    static findByEmail(email) {
        const db = readDB();
        return db.doctors.find(d => d.email === email) || null;
    }

    static create(data) {
        const db = readDB();
        const doctor = {
            id: generateId(),
            name: data.name,
            email: data.email,
            specialization: data.specialization,
            phone: data.phone || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        db.doctors.push(doctor);
        writeDB(db);
        return doctor;
    }

    static update(id, data) {
        const db = readDB();
        const index = db.doctors.findIndex(d => d.id === id);
        if (index === -1) return null;

        db.doctors[index] = {
            ...db.doctors[index],
            ...data,
            updatedAt: new Date().toISOString()
        };
        writeDB(db);
        return db.doctors[index];
    }

    static delete(id) {
        const db = readDB();
        const index = db.doctors.findIndex(d => d.id === id);
        if (index === -1) return false;

        db.doctors.splice(index, 1);
        writeDB(db);
        return true;
    }
}

module.exports = Doctor;
