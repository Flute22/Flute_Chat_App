import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: [true, "Email must be unique"],
        },

        password: {
            type: String,
            required: [true, "Password is Required"],
        },

        firstName: {
            type: String,
            required: false,
        },

        lastName: {
            type: String,
            required: false,
        },

        image: {
            type: String,
            required: false,
        },

        color: {
            type: Number,
            required: false,
        },

        profileSetup: {
            type: Boolean,
            default: false,
        },

        refreshToken: String,
    },
    { timestamps: true }
);

// Password encryption process
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
});

// Creating a method for checking the password is match the encrypted password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Creating a method for generating access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },

        process.env.ACCESS_TOKEN_SECRET,

        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// Creating a method for generating refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },

        process.env.REFRESH_TOKEN_SECRET,

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);
