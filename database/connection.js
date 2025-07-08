import mongoose from 'mongoose';

const connectDB = async () => {
    try {
       await mongoose.connect(process.env.DATABASE_URI)
       console.log("Database connected")
    } catch (error) {
        console.error("Connection to database failed:", error.message)
    }
}

export default connectDB