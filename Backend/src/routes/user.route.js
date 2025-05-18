import Router from "express";
import { register } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/register").post(
  upload.single("profileImage"),
  (req, res, next) => {
    req.body.profileImage = req.file.path;
    next();
  },
  register
);

export default router;
