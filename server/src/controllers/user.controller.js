import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

const logoutUser = asyncHandler( async (req, res) => {
    // First remove the refresh token from the database
    await User.findByIdAndUpdate(
        req.user._id,

        {
            $set: { refreshToken: undefined }
        },

        {
            new: true
        }
    )

    // Then remove the refresh token from the cookie
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out"))
} );

const getUserInfo = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select(
        "-password -refreshToken"
    );

    if (!user) throw new ApiError(404, "User not found");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User info fetched successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        throw new ApiError(401, "Refresh Token missing");
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== refreshToken) {
        throw new ApiError(401, "Invalid Refresh Token");
    }

    const accessToken = jwt.sign(
        { _id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 15 * 60 * 1000, // 15 minutes
    })
        .status(200)
        .json({
            success: true,
            message: "Access token refreshed successfully",
        });
});

const updateProfile = asyncHandler(async (req, res) => {
    // Steps for update profile:
    /* 
        1. Get the user details form frontend
        2. Validation - not empty
        3. Check if user exists: email
        4. Update the user
        5. return the response
    */

    // Get the user details form frontend
    const { firstName, lastName, color } = req.body;

    // Validation - not empty
    if (
        [firstName, lastName].some(
            (field) => typeof field !== "string" || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    //Check if user exists: email
    const user = await User.findByIdAndUpdate(
        req.user._id,

        {
            $set: {
                firstName,
                lastName,
                color,
                profileSetup: true,
            },
        },

        {
            new: true,
            runValidators: true,
        }
    ).select("-password -refreshToken");

    if (!user) throw new ApiError(404, "User not found");

    // return the response
    return res
        .status(200)
        .json(new ApiResponse(200, user, "User profile updated successfully"));
});

const updateProfileImage = asyncHandler(async (req, res) => {
    // Get the user details form frontend
    const profileImageLocalPath = req.file?.path;

    // Validation - not empty
    if (!profileImageLocalPath)
        throw new ApiError(400, "Profile image is missing");

    // Upload image on cloudinary
    const profileImage = await uploadOnCloudinary(profileImageLocalPath);

    if (!profileImage.url) throw new ApiError(400, "Profile image is missing");

    //Check if user exists: email
    const user = await User.findByIdAndUpdate(
        req.user._id,

        {
            $set: {
                image: profileImage.url,
            },
        },

        {
            new: true,
            runValidators: true,
        }
    ).select("-password -refreshToken");

    if (!user) throw new ApiError(404, "User not found");

    // return the response
    return res
        .status(200)
        .json(
            new ApiResponse( 200, user, "User profile image updated successfully" )
        );
});


const removeProfileImage = asyncHandler( async (req, res) => {
    //Check if user exists: email  
    const user = await User.findByIdAndUpdate(
        req?.user._id,

        {
            $set: {
                image: null,
            },
        },

        {
            new: true,
            runValidators: true,
        }
    ).select("-password -refreshToken");
    
    if (!user) throw new ApiError(404, "User not found");
    
    // return the response
    return res
        .status(200)
        .json(
            new ApiResponse( 200, user, "User profile image removed successfully" )
        );
} );


export {
    registerUser,
    loginUser,
    logoutUser,
    getUserInfo,
    refreshAccessToken,
    updateProfile,
    updateProfileImage,
    removeProfileImage,
};
