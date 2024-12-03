import { Router } from "express";
import { verifyToken } from "../utility/jwtTokens.js";
import {
  signUp,
  verifySignUpOtp,
  signIn,
  generateForgotPasswordToken,
  addNewPasswordAfterForgotPassword,
  changePassword,
  facebookLogin,
  googleLogin,
} from "../controller/userAuth.js";
import passport from "passport";

const router = Router();

//routes for users
router.post("/sign-up", signUp);
router.post("/verify-otp", verifySignUpOtp);
router.post("/sign-in", signIn);
router.post("/forgot-password", generateForgotPasswordToken);
router.post("/reset-password", addNewPasswordAfterForgotPassword);
router.post("/change-password", verifyToken, changePassword);

router.post("/facebook/sign-in", facebookLogin); // Facebook login redirect
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  googleLogin
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

export default router;
