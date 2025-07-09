import mongoose from "mongoose";
import User from "../models/index.js";
import { randomBytes } from "crypto";
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

async function submitForm(req, res) {
  try {
    const { fname, lname, email } = req.body;

    // check if email already exists
    const existingEmail = await User.findOne({email})
    
    if(existingEmail) {
      return res.status(400).json({ message: 'Este correo ya existe.'})
    }

    // unique token
    const qrToken = randomBytes(16).toString("hex");
    const qrBuffer = await QRCode.toBuffer(`https://qr-generator-ldfd.onrender.com/confirm?token=${qrToken}`);

    const newUser = new User({
      fname,
      lname,
      email,
      qrToken,
    });

    await newUser.save();

    //Send email
    const transporter = nodemailer.createTransport({ 
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    })

    const mailOptions = {
      from: `<${process.env.MAIL_USER}>`, 
      to: email,
      subject: 'Tu código QR para el evento',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333333;">Hola ${fname},</h2>
        <p style="font-size: 16px; color: #555555;">
          Este es tu <strong>código QR único</strong> para el evento. Por favor, muéstralo al momento de ingresar:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <img src="cid:qrcode" alt="Código QR" style="width: 200px; height: 200px;" />
        </div>
        <p style="font-size: 14px; color: #777777;">
          Si tienes alguna pregunta, no dudes en contactarnos. ¡Nos vemos pronto!
        </p>
      </div>
      `,
      attachments: [
        {
          filename: 'qrcode.png',
          content: qrBuffer,
          cid: 'qrcode'
        }
      ]
    }

      await transporter.sendMail(mailOptions)
      return res.status(201).json({ message: 'Correo enviado exitosamente.', user: newUser }) 
  
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Error al enviar el correo o crear el registro.', error: error.message })
    }
  
}


async function confirmAttendance(req, res) {
  const token = req.query.token;
  
  try {
    const existingToken = await User.findOne({qrToken: token})
    
    if(existingToken) {
      return res.send('El QR es valido ✅')
    } else {
      return res.send('El QR no es valido o no existe ❌')
    }

  } catch (error) {
    console.error(error)
  }
}

const controllers = { submitForm, confirmAttendance };
export default controllers;