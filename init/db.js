import dotenv from "dotenv";
import {Sequelize} from "sequelize";


dotenv.config({ path: "./.env" });

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
    host: process.env.DATABASE_HOST,
    dialect: "postgres",
});

export default sequelize;