import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelizeConnection = new Sequelize(process.env.DATABASE_NAME, 'root', '',
    {
        host: 'localhost',
        dialect: 'mysql',
    }
);



