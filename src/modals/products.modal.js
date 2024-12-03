import { DataTypes } from 'sequelize';
import { sequelizeConnection } from '../database/connection.js';
import Category from './categories.modal.js'

const Product = sequelizeConnection.define("product", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [1, 255],
        },
    },
    type: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 255],
        },
    },
    title: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 255],
        },
    },
    size: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    gender: {
        type: DataTypes.ENUM("male", "female", "unisex"),
        allowNull: false,
        defaultValue: 'unisex'
    },
    description: {
        type: DataTypes.TEXT,
    },
    original_price: {
        type: DataTypes.FLOAT,
    },
    discounted_price: {
        type: DataTypes.FLOAT,
    },
    discount_percentage: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 70
        }
    },
    in_stock: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    about: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 255],
        },
    },
    is_replaceable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    replacement_days: {
        type: DataTypes.INTEGER,
    },
    is_warranty: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    warranty_days: {
        type: DataTypes.INTEGER,
    },
    category_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Category,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['name'],
        },
    ],
});

export default Product;