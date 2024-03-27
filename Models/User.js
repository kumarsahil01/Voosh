// models/user.js
const mongoose = require('mongoose');

const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  githubId: String,
  profilePhoto: String,
  name: String,
  bio: String,
  phone: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  isPublic: { type: Boolean, default: true },
  role: { type: String, default: ROLES.USER, enum: Object.values(ROLES) } 
});

userSchema.methods.comparePassword = function(candidatePassword) {
  return candidatePassword === this.password;
};

module.exports = mongoose.model('User', userSchema);
