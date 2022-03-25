const { genSalt, hash } = require('bcrypt');
const { nanoid } = require('nanoid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await genSalt(10);
    const hashedPassword = await hash('admin', salt);
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'admin',
          email: 'admin@admin.com',
          password: hashedPassword,
          role: 'ADMIN',
          uid: nanoid(),
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
