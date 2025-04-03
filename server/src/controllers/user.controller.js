import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (user_id) => {
    try {
        const user = await User.findById(user_id);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access and refresh token"
        );
    }
};

const options = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const registerUser = asyncHandler(async (req, res) => {
    // Register user
    /* 
       1. Get the user details form frontend
       2. Validation - not empty
       3. Check if user already exists: username, email
       6. Create user object - create entry in database
       7. Remove password and refresh token field from response
       8. return the response
    */

    // Get the user details form frontend
    const { email, password } = req.body;

    // Validation - not empty

    if (
        [email, password].some(
            (field) => typeof field !== "string" || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // Validate email format
    if (!isValidEmail(email)) {
        throw new ApiError(400, "Please provide a valid email address");
    }

    //Check if user already exists: username, email
    const existedUser = await User.findOne({ email });
    if (existedUser) throw new ApiError(409, "User already exists");

    // Create user object - create entry in database
    const user = await User.create({
        email,
        password,
    });

    // Remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    // return the response
    return res
        .status(201)
        .json(
            new ApiResponse(201, createdUser, "User Registered Successfully🥂")
        );
});

const loginUser = asyncHandler(async (req, res) => {
    // Steps for login user:
    /* 
        1. Get the user details form frontend
        2. Validation - not empty
        3. Check if user exists: email
        4. Check the password
        5. Access and Refresh token
        6. return the response
    */

    // Get the user details form frontend
    const { email, password } = req.body;

    // Validation - not empty
    if (
        [email, password].some(
            (field) => typeof field !== "string" || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    //Check if user exists: email
    const user = await User.findOne({ email });

    if (!user)
        throw new ApiError(404, "User does not exists. Please register first.");

    // Check the password
    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) throw new ApiError(401, "Password is incorrect");

    // Access and Refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    // return the response
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,

                {
                    user: loggedInUser,
                    accessToken,
                },

                "User logged in successfully"
            )
        );
});

const getUserInfo = asyncHandler(async ( req, res ) => {
    const user = await User.findById( req.user._id ).select("-password -refreshToken");

    if ( !user ) throw new ApiError(404, "User not found");

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "User info fetched successfully")
        );
} );

export { registerUser, loginUser, getUserInfo };
