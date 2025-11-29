import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Relasi One-to-Many: 1 User → Banyak Presensi
      User.hasMany(models.Presensi, { 
        foreignKey: "userId",
        as: "presensi",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  User.init(
    {
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("mahasiswa", "admin"),
        allowNull: false,
        defaultValue: "mahasiswa",
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};
