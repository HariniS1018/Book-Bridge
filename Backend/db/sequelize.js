import dotenv from "dotenv";
import {Sequelize} from "sequelize";


dotenv.config({ path: "./.env" });

const sequelize = new Sequelize(
  process.env.POSTGRESQL_DB_NAME,
  process.env.POSTGRESQL_DB_USERNAME,
  process.env.POSTGRESQL_DB_PASSWORD,
  {
    host: process.env.POSTGRESQL_DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

export { sequelize };