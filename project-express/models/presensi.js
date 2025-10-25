
export default (sequelize, DataTypes) => {
  const Presensi = sequelize.define(
    "Presensi",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      checkIn: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      checkOut: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "presensis",
      timestamps: true,
    }
  );

  return Presensi;
};
