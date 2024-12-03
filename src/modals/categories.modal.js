import { DataTypes } from 'sequelize';
import { sequelizeConnection } from '../database/connection.js';

export const Category = sequelizeConnection.define("Category", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

},
    {
        timestamps: true,
        tableName: 'categories'
    })

export default Category