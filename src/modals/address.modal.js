import { DataTypes } from 'sequelize';
import { sequelizeConnection } from '../database/connection.js';
import User from './user.modal.js';

const Address = sequelizeConnection.define('Address', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // Automatically generate UUID
    },
    owner_id: {
        type: DataTypes.UUID,
        allowNull: false, // Set to `false` to ensure every address is linked to a user
        references: {
            model: User,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    street: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('street', value.toLowerCase());
        },
    },
    landmark: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value) {
            this.setDataValue('landmark', value.toLowerCase());
        },
    },
    isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('city', value.toLowerCase());
        },
    },

    zipCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default Address;
