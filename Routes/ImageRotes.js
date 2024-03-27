const express =require('express')
const router=express.Router()
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const {uploadImage} =require('../Controllers/ImageController')
const verifyToken = require('../Middlewares/AuthMiddleware')

router.post('/uploadImage',verifyToken,upload.single('photo'),uploadImage)

module.exports= router