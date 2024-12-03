import { DataTypes } from 'sequelize';
import { sequelizeConnection } from '../database/connection.js';
import User from './user.modal.js';
import Product from './products.modal.js';
import Address from './address.modal.js';

const Order = sequelizeConnection.define(
    'Order',
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        isDispatched: { // Fixed typo
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        isDelivered: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        isReturnable: { // Changed to camelCase
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        owner_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        product_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Product,
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        address_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Address,
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',

        },
    },
    {
        timestamps: true,
    }
);

export default Order;
