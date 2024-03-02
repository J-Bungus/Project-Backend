const express = require('express');
const multer = require('multer');
const { addSchool, getSchools } = require('./query');

const router = express.Router();
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

router.post('/addSchool', upload.single('image'), async (req, res) => {
    try {
        const { name, about } = req.body;
        if (req.file) {
            const { filename, buffer } = req.file;
            const newSchool = await addSchool({
                name: name, 
                about: about,
                filename: filename,
                image: buffer 
            });
            res.status(201).json(newSchool);
        } else {
            const newSchool = await addSchool({
                name: name,
                about: about
            });

            res.status(201).json(newSchool);
        }        
    } catch (err) {
        res.status(500).json({ error: 'Internal server error at post ' + err});
    }
});

router.get('/getSchools', async (req, res) => {
    try {
        const { count } = req.body;
        const schools = await getSchools(count);
        res.json(schools);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;