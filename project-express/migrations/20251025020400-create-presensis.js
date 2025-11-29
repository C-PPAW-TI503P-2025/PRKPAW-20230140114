'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Buat tabel presensis
    await queryInterface.createTable('presensis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Relasi ke tabel Users
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      checkIn: {
        allowNull: false,
        type: Sequelize.DATE
      },
      checkOut: {
        allowNull: true,
        type: Sequelize.DATE
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 2. Tambah kolom latitude & longitude (jika kamu pakai migration terpisah juga)
    // Ini akan jalan setelah tabel dibuat, supaya tidak error
    await queryInterface.addColumn('presensis', 'latitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true
    });
    await queryInterface.addColumn('presensis', 'longitude', {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Hapus tabel saat di-rollback
    await queryInterface.dropTable('presensis');
  }
};
