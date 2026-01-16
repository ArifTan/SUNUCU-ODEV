const { readDB, writeDB, generateId } = require('../config/db');

class Patient {
    static findAll() {
        const db = readDB();
        return db.patients;
    }

    static findByPk(id) {
        const db = readDB();
        return db.patients.find(p => p.id === id) || null;
    }

    static findByEmail(email) {
        const db = readDB();
        return db.patients.find(p => p.email === email) || null;
    }

    static create(data) {
        const db = readDB();
        const patient = {
            id: generateId(),
            name: data.name,
            email: data.email,
            phone: data.phone,
            birthDate: data.birthDate || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        db.patients.push(patient);
        writeDB(db);
        return patient;
    }

    static update(id, data) {
        const db = readDB();
        const index = db.patients.findIndex(p => p.id === id);
        if (index === -1) return null;

        db.patients[index] = {
            ...db.patients[index],
            ...data,
            updatedAt: new Date().toISOString()
        };
        writeDB(db);
        return db.patients[index];
    }

    static delete(id) {
        const db = readDB();
        const index = db.patients.findIndex(p => p.id === id);
        if (index === -1) return false;

        db.patients.splice(index, 1);
        writeDB(db);
        return true;
    }
}

module.exports = Patient;
