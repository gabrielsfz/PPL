// tests/setup.js
const sequelize = require('../src/config/database');

// Setup test database
beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true }); // Reset database for tests
});

// Clean up after all tests
afterAll(async () => {
  await sequelize.close();
});

// Clean up after each test
afterEach(async () => {
  // Clear all tables after each test
  const models = Object.values(sequelize.models);
  for (const model of models) {
    await model.destroy({ where: {}, force: true });
  }
});