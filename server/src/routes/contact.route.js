import { Router } from "express";
import { getContactsForDMList, searchContacts } from "../controllers/contact.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/search-contacts").post(verifyJwt, searchContacts);
router.route("/get-contacts").get(verifyJwt, getContactsForDMList);

export { router };
