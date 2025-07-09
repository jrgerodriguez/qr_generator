import express from 'express';
import dotenv from 'dotenv';
import controller from '../controllers/index.js'
dotenv.config();
const router = express.Router();

router.post('/submit', controller.submitForm)

router.get('/confirm', controller.confirmAttendance)

export default router;