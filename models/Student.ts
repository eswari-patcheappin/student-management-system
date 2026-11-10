import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document{
    name: string;
    email: string;
    phone: string;
    department: string;
    year: number;
}

const StudentSchema = new Schema<IStudent>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: [true, "Phone number is required"],
            match: [/^\d{10}$/, "Phone must contain 10 digits"],
        },

        department: {
            type: String,
            required: [true, "Department is required"],
            trim: true,
        },

        year: {
            type: Number,
            required: [true, "Year is required"],
            min: 1,
            max: 4,
        },
    },
    {
        timestamps: true,
    }
);

const Student = (mongoose.models.Student as mongoose.Model<IStudent>) ||
    mongoose.model<IStudent>("Student", StudentSchema);
  
export default Student;