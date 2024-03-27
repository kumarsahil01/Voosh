const express =require('express')
const router=express.Router()
const {me,editProfile,updateProfilePrivacy,getAllUserProfiles}=require('../Controllers/UserController.js')
const verifyToken = require('../Middlewares/AuthMiddleware')

router.get('/me',me);
router.put('/update/:id',verifyToken,editProfile)
router.put('/update/:id/privacy',verifyToken,updateProfilePrivacy)
router.get('/getprofiles',verifyToken,getAllUserProfiles)

module.exports= router