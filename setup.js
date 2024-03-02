const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');

const cert = fs.readFileSync('./DigiCertGlobalRootCA.crt.pem');
const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
    host: process.env.PGHOST,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectAuthorization: false,
            ca: cert
        }
    }
});

const Schools = sequelize.define('Schools', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(75),
        allowNull: false
    },
    about: {
        type: DataTypes.STRING,
        allowNull: false
    },
    blobURL: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

async function syncDatabase() {
    try {
        await sequelize.sync({alter: true});
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
}

syncDatabase();

module.exports = Schools;