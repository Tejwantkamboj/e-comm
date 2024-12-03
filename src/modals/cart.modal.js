import { DataTypes } from 'sequelize';
import { sequelizeConnection } from '../database/connection.js';
import User from './user.modal.js';
import Product from './products.modal.js';

const Cart = sequelizeConnection.define(
    'Cart', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1,
        },
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
        allowNull: true,
        references: {
            model: Product,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },

}, {
    timestamps: true,
})

export default Cart