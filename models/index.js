import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  qrToken: { type: String, unique: true },
  scanned: { type: Boolean, default: false },
  scannedAt: { type: Date, default: null },
});

const User = mongoose.model('User', userSchema);
export default User;