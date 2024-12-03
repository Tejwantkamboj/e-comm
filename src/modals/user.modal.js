import { DataTypes } from 'sequelize';
import { sequelizeConnection } from '../database/connection.js';

// Define the User model
const User = sequelizeConnection.define('User', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('firstName', value.toLowerCase());
        },
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('lastName', value.toLowerCase());
        },
    },
    email: {
        type: DataTypes.STRING,
        isEmail: true,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
        set(value) {
            this.setDataValue('email', value.toLowerCase());
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isNumeric: true,
            len: [10, 12],
        },
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: false,
    },
    user_type: {
        type: DataTypes.ENUM('default', 'facebook', 'user'),
        allowNull: false,
        defaultValue: 'default',
    },

    refresh_token: {
        type: DataTypes.STRING,
        defaultValue: null,
        allowNull: true
    },

    // OTP fields
    signup_otp: {
        type: DataTypes.STRING,
        defaultValue: null,
        allowNull: true,
    },
    signup_otp_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    forgot_password_otp: {
        type: DataTypes.STRING,
        defaultValue: null,
        allowNull: true,
    },
    forgot_password_otp_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null,

    },
    change_password_otp: {
        type: DataTypes.STRING,
        defaultValue: null,
        allowNull: true,
    },
    change_password_otp_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },

}, {
    timestamps: true,
});

export default User;

