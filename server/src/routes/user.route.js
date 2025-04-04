import { Router } from "express";
import {
    getUserInfo,
    loginUser,
    registerUser,
    updateProfile,
    updateProfileImage,
    removeProfileImage,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/user-info").get(verifyJwt, getUserInfo);
router.route("/update-profile").patch(verifyJwt, updateProfile);
router.route("/add-profile-image").put(verifyJwt, upload.single("profile-image"), updateProfileImage);
router.route("/delete-profile-image").delete(verifyJwt, removeProfileImage);

export { router };
