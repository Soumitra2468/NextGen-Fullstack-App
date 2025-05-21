import Router from "express";
import { register, login, logout } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
const router = Router();

router
  .route("/register")
  .post(upload.fields([{ name: "profileImage", maxCount: 1 }]), register);

router.route("/login").post(login);

router.route("/logout").post(verifyJWT, logout);
export default router;
