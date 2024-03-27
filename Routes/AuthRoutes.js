const express =require('express')
const router=express.Router()
const {signup, signin, logout}=require('../Controllers/AuthController')
const verifyToken = require('../Middlewares/AuthMiddleware');
const passport=require('../Controllers/GithubAuth')

router.post('/signup',signup);
router.post('/signin',signin);
router.post('/logout',logout)

//create auth route for github 
router.get('/github',passport.authenticate('github',{scope:['user:email']}))
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.status(200).json({"message":"auth done"})
  }
);
module.exports= router