const cloudinary=require('../utils/cloudinary')
const multer=require("multer")
const Image=require('../Models/Image');
const User = require('../Models/User');

async function UploadFileToCLoud(filePath){
    try{
        console.log(filePath)
        const result=await cloudinary.uploader.upload(filePath);
        return result.url;
    }catch(error){
        console.log("Error uploading to CLoudinary ",error)
    }
}

exports.uploadImage= async (req,res)=>{
  let imageUrl;
  const userId=req.userId
  const user=await User.findById(userId)
  if(user){
    if (req.body.imageUrl) {
        imageUrl = req.body.imageUrl;
      } else if (req.file) {
        try {
            console.log(req.file.path)
          imageUrl = await UploadFileToCLoud(req.file.path);
        } catch (error) {
          return res.status(500).send('Error uploading image.');
        }
      } else {
        return res.status(400).send('No image URL or file provided.');
      }
      // save image_url to database
      try {
        const newImage = new Image({ imageUrl });
        await newImage.save();
        res.send({ message: 'Image processed successfully.', imageUrl });
      } catch (error) {
        console.error('Error saving image URL to the database:', error);
        res.status(500).send('Error saving image URL.');
      }
  }else{
    res.status(400).send("user not found")
  }
 
}