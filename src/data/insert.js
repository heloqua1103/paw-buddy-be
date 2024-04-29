const { faker, en } = require("@faker-js/faker");
const db = require("../models");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const hashPassword = (password) => bcrypt.hashSync(password, salt);

require("../dbs/connect_DB");

const insert = () =>
  new Promise(async (resolve, reject) => {
    try {
      Array.from([...Array(10).keys()]).forEach(async (el) => {
        if (el === 0) {
          await db.User.create({
            email: "admin@gmail.com",
            password: hashPassword("123456"),
            roleId: 1,
          });
        }

        if (el === 1 || el === 2 || el === 3) {
          await db.User.create({
            fullName: faker.person.fullName(),
            email: faker.internet.email({
              provider: "gmail.com",
              allowSpecialCharacters: false,
            }),
            password: hashPassword("123456"),
            roleId: 2,
            phone: "0" + faker.string.numeric(9),
            avatar: faker.image.avatar(),
            address: faker.location.streetAddress({ useFullAddress: true }),
            gender: Math.random > 0.5 ? "true" : "false",
          });
        } else {
          await db.User.create({
            fullName: faker.person.fullName(),
            email: faker.internet.email({
              provider: "gmail.com",
              allowSpecialCharacters: false,
            }),
            password: hashPassword("123456"),
            roleId: 3,
            phone: "0" + faker.string.numeric(9),
            avatar: faker.image.avatar(),
            address: faker.location.streetAddress({ useFullAddress: true }),
            gender: Math.random > 0.5 ? "true" : "false",
          });
        }
      });

      Array.from([...Array(20).keys()]).forEach(async (el) => {
        await db.Pet.create({
          user_id: faker.helpers.arrayElement([5, 6, 7, 8, 9, 10, 11]),
          name_pet: faker.animal.dog(),
          breed: faker.animal.dog({ breed: true }),
          date_of_birth: faker.date.past(),
          adoption: faker.date.past(),
          weight: faker.number.int({ min: 1, max: 50 }),
          photo: faker.image.avatar(),
          is_neutered: faker.helpers.arrayElement([true, false]),
          species: 1,
          size: faker.helpers.arrayElement(["Small", "Medium", "Large"]),
        });
      });

      resolve("Done");
    } catch (error) {
      reject(error);
    }
  });

insert();
