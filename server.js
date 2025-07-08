import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js'
import connectDB from './database/connection.js';

const app = express();
dotenv.config();

const port = process.env.PORT

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes)

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ App running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Connection to database failed:", error.message);
    process.exit(1); 
  });