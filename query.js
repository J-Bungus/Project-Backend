const { BlobServiceClient } = require('@azure/storage-blob');
const Schools = require('./setup');
const { v1: uuidv1 } = require("uuid");
require('dotenv').config();

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.BLOBSTRING);
const containerClient = blobServiceClient.getContainerClient('dreamschools');

const addSchool = async (school) => {
    const blobName = 'images' + uuidv1() + school.filename;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const blobURL = blockBlobClient.url;
    try {    
        await blockBlobClient.uploadData(school.image);
        const newSchool = await Schools.create({
            name: school.name,
            about: school.about,
            blobURL: blobURL
        });
        return newSchool;
    } catch (err) {
        console.error('Error creating new school:', err);
        throw err;
    }
}

const getSchools = async (count) => {
    try {
        const schools = await Schools.findAll({ limit: count });
        return schools;
    } catch (err) {
        console.error('Error retrieving schools: ', err);
        throw err;
    }
}

module.exports = { addSchool, getSchools };
