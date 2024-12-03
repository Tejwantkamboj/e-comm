import bcrypt from 'bcrypt';
import { sendOTPEmail } from '../utility/sendEmailOtp.js';
import { Op } from 'sequelize';
import { responseData } from '../utility/responseData.js';
import { generateAccessToken, generateRefreshToken } from '../utility/jwtTokens.js';
import { getUserModal } from '../utility/modalImports.js';
import { genrateOtp } from '../utility/genrateOtp.js';
import { encryptData, decryptData } from '../utility/encryptData.js';
import passport from 'passport';


export const signUp = async (req, res) => {

    const { firstName, lastName, email, password, phone, gender } = req.body;
    const User = await getUserModal();

    try {
        const existedUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { phone }],
            },
        });

        if (existedUser) {
            return res.status(400).json({ message: 'User with this email or phone already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);


        const otp = genrateOtp()

        console.log("req.body data otp", otp)
        // Create a new user
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            gender,
            signup_otp: otp,
            user_type: "default"
        });

        // Prepare email body
        // const emailBody = `Your OTP for signup is: ${otp} valid for 10 minutes`;
        // const sendOtp = await sendOTPEmail(email, emailBody, "OTP for Signup");


        const encryptedResponse = encryptData(newUser);

        const dcryptedData = decryptData(encryptedResponse.encryptedData, encryptedResponse.iv)

        return res.status(201).json({ success: true, message: 'OTP for verification has been sent to your email.', user: newUser, encryptedResponse: encryptedResponse, dcryptedData: dcryptedData });

        // if (sendOtp === true) {

        //     setTimeout(async () => {
        //         const userToCheck = await User.findByPk(newUser.id);
        //         if (userToCheck && userToCheck.signup_otp !== null) {
        //             await User.destroy({ where: { id: newUser.id } });
        //             console.log(`User with ID ${newUser.id} was deleted due to unverified OTP.`);
        //         }
        //     }, 1000 * 60 * 10);

        //     return res.status(201).json({ success: true, message: 'OTP for verification has been sent to your email.', user: newUser });
        // } else {
        //     await User.destroy({ where: { id: newUser.id } })
        //     return res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again later.' });
        // }


    } catch (error) {
        console.error('Error during signup:', error); // Log the error for debugging
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }

};

export const verifySignUpOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const User = await getUserModal();

        // Find the user by email
        const findUser = await User.findOne({ where: { email } });
        if (!findUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Check if the OTP matches
        if (findUser.signup_otp === otp) {

            findUser.signup_otp = null;
            findUser.signup_otp_verified = true;

            await findUser.save(); // Save the updated user

            return res.status(200).json({ success: true, message: "OTP verified successfully." });
        } else {
            return res.status(400).json({ success: false, message: "Invalid OTP. Please try again." });
        }
    } catch (error) {
        console.error("Error in verifying OTP:", error);
        return res.status(500).json({ success: false, message: "Error while verifying OTP." });
    }
};

export const signIn = async (req, res) => {
    const { email, password } = req.body

    try {
        const User = await getUserModal();

        const existedUser = await User.findOne({ where: { email } });

        if (!existedUser) {
            return res.status(400).json({ message: 'User with this email or phone is not found.Please signUp first' });
        }

        const passwordCheck = await bcrypt.compare(password, existedUser.password)

        if (!passwordCheck) {
            return responseData(res, 409, false, 'Wrong password.');
        }

        const refreshToken = generateRefreshToken(existedUser);
        const accessToken = generateAccessToken(existedUser)

        existedUser.refresh_token = refreshToken;
        await existedUser.save();

        const user = {
            id: existedUser.id,
            firstname: existedUser.firstname,
            lastname: existedUser.lastname,
            email: existedUser.email,
            phone: existedUser.phone,
            gender: existedUser.gender,
            auth: accessToken
        }
        return res.status(200).json({ success: true, message: "SignUp successfull", user })

    } catch (error) {
        console.error("error while signup", error);
        res.status(500).json(error)
    }
};

export const generateForgotPasswordToken = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    try {
        const User = await getUserModal();
        const existingUser = await User.findOne({ where: { email } });

        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Generate OTP and send email
        const otp = genrateOtp();
        // await sendOTPEmail(existingUser.email, otp, "Forgot Password OTP");

        // Update user record with OTP and verification status
        existingUser.forgot_password_otp = otp;
        existingUser.forgot_password_otp_verified = false;
        await existingUser.save();

        // Clear OTP after 10 minutes
        setTimeout(async () => {
            try {
                const user = await User.findOne({ where: { email } }); // Fetch fresh data
                if (user && user.forgot_password_otp) {
                    user.forgot_password_otp = null;
                    user.forgot_password_otp_verified = null;
                    await user.save();
                }
            } catch (error) {
                console.error('Error clearing OTP:', error);
            }
        }, 1000 * 60 * 10);

        return res.status(200).json({
            success: true,
            message: 'OTP for Forgot Password has been sent to your registered email.',
            user: existingUser
        });
    } catch (error) {
        console.error('Error generating forgot password OTP:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

export const addNewPasswordAfterForgotPassword = async (req, res) => {
    const { email, otp, password } = req.body;

    // Validate request body
    if (!email || !otp || !password) {
        return res.status(400).json({ success: false, message: 'All fields are mandatory.' });
    }

    try {
        const User = await getUserModal();
        const existingUser = await User.findOne({ where: { email } });

        // Check if the user exists
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Verify OTP
        if (existingUser.forgot_password_otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
        }

        // Hash the new password and update user
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
        existingUser.forgot_password_otp = null; // Clear OTP
        existingUser.forgot_password_otp_verified = null; // Clear verification flag
        await existingUser.save();

        // Respond with success
        return res.status(200).json({
            success: true,
            message: 'Password changed successfully. Please login again.',
        });

    } catch (error) {
        console.error('Error during password reset:', error); // Log for debugging
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

export const changePassword = async (req, res) => {
    const { email, password, newPassword } = req.body


    console.log("body data", req.body)
    if (!email || !password || !newPassword) {
        return res.status(400).json({ success: false, message: 'All fields are mandatory.' });
    }

    try {
        const User = await getUserModal();
        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect current password.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        existingUser.password = hashedPassword;
        await existingUser.save();

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully.',
        });
    } catch (error) {
        console.error('Error during password change:', error); // Log for debugging
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};


// Transfer Money Controller with Managed Transactions
export const transferMoney = async (req, res) => {
    const { fromUserId, toUserId, amount } = req.body;

    if (!fromUserId || !toUserId || !amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {
        // Use managed transaction
        await sequelize.transaction(async (t) => {
            // Fetch sender
            const User = await getUserModal();
            const sender = await User.findByPk(fromUserId, { transaction: t });
            if (!sender) throw new Error('Sender account not found');

            // Check if sender has enough balance
            if (sender.balance < amount) {
                throw new Error('Insufficient balance');
            }

            // Fetch receiver
            const receiver = await User.findByPk(toUserId, { transaction: t });
            if (!receiver) throw new Error('Receiver account not found');

            // Deduct from sender's balance
            sender.balance -= amount;
            await sender.save({ transaction: t });

            // Add to receiver's balance
            receiver.balance += amount;
            await receiver.save({ transaction: t });
        });

        res.status(200).json({ message: 'Transfer successful' });
    } catch (error) {
        res.status(500).json({ error: 'Transfer failed', details: error.message });
    }
};


export const facebookLogin = (req, res, next) => {
    passport.authenticate("facebook", { session: false }, async (err, user, info) => {
        try {
            if (err || !user) {
                return res.status(401).json({ error: "Authentication failed" });
            }

            // Extract user data
            const userData = {
                id: user.id,
                name: user.displayName,
                email: user.emails?.[0]?.value || null,
                profilePic: user.photos?.[0]?.value || null,
            };

            // Get the User model
            const User = await getUserModal();

            // Check if the user already exists
            const existedUser = await User.findOne({ where: { email: userData.email } });

            // Generate a JWT token
            const token = generateJwtToken(userData);

            if (existedUser) {
                // Return existing user data
                return res.status(201).json({
                    success: true,
                    user: userData,
                    token,
                });
            }

            // Create a new user if not found
            await User.create({
                firstName: userData.name,
                lastName: userData.name,
                email: userData.email,
                user_type: "facebook",
            });

            // Return new user data
            return res.status(200).json({
                success: true,
                user: userData,
                token,
            });
        } catch (error) {

            console.error("Error in Facebook callback:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    })(req, res, next);
};


export const googleLogin = async (req, res) => {
      console.log("response from google" , res.req.user)
      return res.status(201).json({
        success: true,
        message: "Login successful",
        user: req.user,
      });
    
}
