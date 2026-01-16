const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');

// Veritabanı başlangıç yapısı
const defaultData = {
    patients: [],
    doctors: [],
    appointments: []
};

// Veritabanını oku
const readDB = () => {
    try {
        if (!fs.existsSync(dbPath)) {
            fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
        }
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Veritabanı okuma hatası:', error);
        return defaultData;
    }
};

// Veritabanına yaz
const writeDB = (data) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Veritabanı yazma hatası:', error);
    }
};

// Benzersiz ID oluştur
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const connectDB = async () => {
    try {
        readDB(); // Veritabanı dosyasını oluştur
        console.log('JSON Veritabanı Bağlantısı Başarılı');
        console.log(`Veritabanı dosyası: ${dbPath}`);
    } catch (error) {
        console.error(`Veritabanı Hatası: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { readDB, writeDB, generateId, connectDB };
