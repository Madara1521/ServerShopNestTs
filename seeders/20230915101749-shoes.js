import { faker } from '@faker-js/faker';
('use strict');

const shoesManufacturesrs = [
  'Timberland',
  'Adidas',
  'Puma',
  'Nike',
  'New Balance',
  'CAT',
  'Ralf Ringer',
  'Jack Wolfskin',
  'Salomon',
];

const countryManufacturesrs = [
  'Ukraine',
  'China',
  'Germany ',
  'France',
  'Italy',
  'Poland',
  'England',
  'Switzerland',
  'Japan',
];

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  return queryInterface.bulkInsert(
    'Shoes',
    [...Array(100)].map(() => ({
      shoes_manufacturer:
        shoesManufacturesrs[
          Math.floor(Math.random() * shoesManufacturesrs.length)
        ],
      country_maufacturer:
        countryManufacturesrs[
          Math.floor(Math.random() * countryManufacturesrs.length)
        ],
      price: faker.random.numeric(4),
      name: faker.lorem.sentence(2),
      description: faker.lorem.sentence(10),
      images: JSON.stringify(
        [...Array(7)].map(
          () => `${faker.image.fashion()}?random=${faker.random.numeric(30)}`,
        ),
      ),
      vendor_code: faker.internet.password(),
      in_stock: faker.random.numeric(1),
      bestseller: faker.datatype.boolean(),
      new: faker.datatype.boolean(),
      popularity: faker.random.numeric(3),
      compatibility: faker.lorem.sentence(7),
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  );
}
export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete('Shoes', null, {});
}
