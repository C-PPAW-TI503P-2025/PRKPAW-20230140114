
import { Sequelize } from "sequelize";
import PresensiModel from "./presensi.js";

const sequelize = new Sequelize("pratikum_114_db", "root", "Sambeng13", {
  host: "127.0.0.1",
  port: 3309,
  dialect: "mysql",
  logging: false,
});

const Presensi = PresensiModel(sequelize, Sequelize.DataTypes);

const db = { sequelize, Sequelize, Presensi };

export default db;
