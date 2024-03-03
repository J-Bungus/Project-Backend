const { BlobServiceClient } = require('@azure/storage-blob');
const Schools = require('./setup');
const { v1: uuidv1 } = require("uuid");
require('dotenv').config();

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.BLOBSTRING);
const containerClient = blobServiceClient.getContainerClient('dreamschools');

const addSchool = async (school) => {
    let blobURL = "";
    let blobName = "";
    if (school.image) {
        blobName = 'images' + uuidv1() + school.filename;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        blobURL = blockBlobClient.url;
        await blockBlobClient.uploadData(school.image);
    }
   
    try {  
        const newSchool = await Schools.create({
            name: school.name,
            about: school.about,
            blobName: blobName,
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

const updateSchool = async (updateData) => {
    const { id, name, about, blobName, blobURL } = updateData;
    try {
        const school = await Schools.findByPk(id);
        
        if (!school) {
            console.log("Not found. Something very bad has happened!");
        }

        school.set ({
            name: name,
            about: about,
            blobName: blobName,
            blobURL: blobURL
        });
        await school.save();

        return school;

    } catch (err) {
        console.err("Error while searching for school with id: " + id + "\n" + err);
    }
}

const deleteBlob = async (id) => {
    try {
        const school = await Schools.findByPk(id);
        const blobName = school.blobName;
        if (blobName) {
            containerClient.deleteBlob(blobName);
        }

    } catch (err) {
        console.err("Error while retrieving blob name");
    }
}

const addBlob = async (imageData) => {
    const blobName = 'images' + uuidv1() + imageData.filename;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    blobURL = blockBlobClient.url;
    await blockBlobClient.uploadData(imageData.image);
    return [ blobURL, blobName ];
}

module.exports = { addSchool, getSchools, updateSchool, deleteBlob, addBlob };
