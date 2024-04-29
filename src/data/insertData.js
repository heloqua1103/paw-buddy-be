const dataVaccines = require("./vaccine.json");
const dataPetServices = require("./petService.json");
const dataMedicines = require("./medicineData.json");
const dataRoles = require("./role.json");
const dataServiceCategory = require("./serviceCategoryData.json");
const db = require("../models");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const hashPassword = (password) => bcrypt.hashSync(password, salt);
const { faker, en } = require("@faker-js/faker");

require("../dbs/connect_DB");

const insert = () =>
  new Promise(async (resolve, reject) => {
    try {
      dataPetServices.forEach(async (petService) => {
        await db.PetService.create({
          name_service: petService.name_service,
          description: petService.description,
          price: petService.price,
          photo: petService.photo,
          species: petService.species,
          note: petService.note,
          estimated_duration: petService.estimated_duration,
          category_id: petService.category_id,
        });
      });

      dataVaccines.forEach(async (vaccine) => {
        await db.Vaccine.create({
          name_vaccine: vaccine.name_vaccine,
          type_disease: vaccine.type_disease,
          manufacturer: vaccine.manufacturer,
          number_of_doses: vaccine.number_of_doses,
          vaccination_schedule: vaccine.vaccination_schedule,
          contraindication: vaccine.contraindication,
          side_effect: vaccine.side_effect,
          price: vaccine.price,
          quantity: vaccine.quantity,
          status: vaccine.status,
          note: vaccine.note,
        });
      });

      dataMedicines.forEach(async (medicine) => {
        await db.Medicine.create({
          name_medicine: medicine.name_medicine,
          ingredient: medicine.ingredient,
          intended_use: medicine.intended_use,
          guide: medicine.guide,
          indication: medicine.indication,
          contraindication: medicine.contraindication,
          side_effect: medicine.side_effect,
          price: medicine.price,
          stock: medicine.stock,
          unit: medicine.unit,
          expiry_date: medicine.expiry_date,
        });
      });

      dataServiceCategory.forEach(async (serviceCategory) => {
        await db.ServiceCategory.create({
          type_service: serviceCategory.type_service,
          image: serviceCategory.image,
        });
      });
      dataRoles.forEach(async (role) => {
        await db.Role.create({
          name_role: role.name_role,
        });
      });
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
          gender: faker.helpers.arrayElement([true, false]),
        });
      });

      Array.from([...Array(10).keys()]).forEach(async (el) => {
        await db.Feedback.create({
          user_id: faker.number.int({ min: 1, max: 10 }),
          point: faker.number.float({ min: 1, max: 5 }),
          comment: faker.lorem.sentence(),
          service_id: faker.number.int({ min: 1, max: 10 }),
          booking_id: faker.number.int({ min: 1, max: 10 }),
        });
      });

      resolve("Done");
    } catch (error) {
      reject(error);
    }
  });
insert();
