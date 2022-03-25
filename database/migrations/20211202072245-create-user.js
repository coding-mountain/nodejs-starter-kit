module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uid: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      status: {
        type: Sequelize.ENUM('INACTIVE', 'ACTIVE', 'BANNED', 'DELETED'),
        defaultValue: 'INACTIVE',
        allowNull: false,
      },

      emailVerifiedAt: {
        type: Sequelize.DATE,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      verifyToken: {
        type: Sequelize.STRING,
      },
      verifyTokenGeneratedAt: {
        type: Sequelize.DATE,
      },
      role: {
        type: Sequelize.ENUM('ADMIN', 'VENDOR', 'USER'),
      },
      authToken: {
        type: Sequelize.STRING(255),
      },
      forgotPasswordToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      forgotPasswordTokenGeneratedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Users');
  },
};
