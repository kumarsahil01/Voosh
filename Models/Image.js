const { Schema, model } = require('mongoose');

const imageSchema = new Schema({
  imageUrl: {
    type: String,
    required: true
  },
  
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false 
  }
}, { timestamps: true });

const Image = model('Image', imageSchema);

module.exports = Image;