import { Router } from "express";
import { getUserInfo, loginUser, registerUser, refreshAccessToken, updateProfile} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/user-info").get(verifyJwt, getUserInfo);
router.route("/refresh-token").get(refreshAccessToken);
router.route("/update-profile").patch(verifyJwt, updateProfile);

export { router };
