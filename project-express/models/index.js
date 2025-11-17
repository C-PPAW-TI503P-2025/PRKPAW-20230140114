import { Sequelize } from "sequelize";
import PresensiModel from "./presensi.js";
import UserModel from "./user.js";

const sequelize = new Sequelize("pratikum_114_db", "root", "123456", {
  host: "127.0.0.1",
  port: 3309,
  dialect: "mysql",
  logging: false,
  timezone: "+07:00",
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
});

const Presensi = PresensiModel(sequelize, Sequelize.DataTypes);
const User = UserModel(sequelize, Sequelize.DataTypes); // ← samakan!

const db = { sequelize, Sequelize, Presensi, User };

export default db;
