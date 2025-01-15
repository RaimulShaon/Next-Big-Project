import { Schema } from "mongoose";
import mongoose from "mongoose";

export interface message extends mongoose.Document {
    content: string;
    createdAt: Date;
}

const messageSchema: Schema<message> = new mongoose.Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
});

export interface User extends mongoose.Document {
username: string;
email: string;
password: string;
verifiedCode: string;
verifiedCondeExpires: Date;
isVerified: boolean;
isacceptingMessages: boolean;
messages: message[];
}

const UserSchema: Schema<User> = new mongoose.Schema({
    username: {
        type: "string",
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: "string",
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address']
    },
    password: {
        type: "string",
        required: [true, "Password is requered"],
    },
    verifiedCode: {
        type: "string",
        required: [true, "Verify code is requered"],
    },
    verifiedCondeExpires: {
        type: Date,
        required: [true, "Verify code Expiry is requered"],
    },
    isVerified: {
        type: 'boolean',
        required: [true, "Verify code is requered"],
    },
    isacceptingMessages: {
        type: "boolean",
        required: [true, "Verify code is requered"],
    },
    messages: [messageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User> )|| mongoose.model<User>('User', UserSchema)

export default UserModel