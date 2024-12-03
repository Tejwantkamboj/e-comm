import { Router } from 'express';

import { signUp, verifySignUpOtp, signIn } from "../controller/userAuth.js"

const router = Router();

//routes for users
router.post('sign-up', signUp);
router.post('verify-otp', verifySignUpOtp);
router.post('sign-in', signIn);

export default router