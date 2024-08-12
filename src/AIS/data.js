// fakeData.js
import { faker } from '@faker-js/faker';

const shipNames = [
  "SS Voyager", "SS Explorer", "SS Odyssey", "SS Horizon", 
  "SS Atlantis", "SS Endeavour", "SS Quest", "SS Serenity"
];

export const generateShipData = (year) => {
  const ships = [];
  for (let i = 0; i < 50; i++) {
    ships.push({
      name: shipNames[Math.floor(Math.random() * shipNames.length)],
      route: `${faker.address.city()} - ${faker.address.city()}`,
      status: faker.helpers.arrayElement(['In Transit', 'Docked', 'Anchored']),
      speed: faker.datatype.float({ min: 0, max: 30 }),
      time: faker.date.between(`${year}-01-01`, `${year}-12-31`).toISOString(),
    });
  }
  return ships;
};
