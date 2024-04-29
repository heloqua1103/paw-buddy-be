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

dataRoles.forEach(async (role) => {
  await db.Role.create({
    name_role: role.name_role,
  });
});

await db.User.create({
  email: "admin@gmail.com",
  password: hashPassword("123456"),
  roleId: 1,
});

function createRandomUser() {
  return {
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: hashPassword("123456"),
    roleId: 2,
    gender: Math.random > 0.5 ? "true" : "false",
    phone: "0" + faker.string.numeric(9),
    fullName: faker.person.fullName(),
    address: faker.location.streetAddress({ useFullAddress: true }),
  };
}

const VETS = faker.helpers.multiple(createRandomUser, {
  count: 3,
});

VETS.forEach(async (user) => {
  await db.User.create({
    email: user.email,
    avatar: user.avatar,
    password: user.password,
    roleId: user.roleId,
    fullName: user.fullName,
    address: user.address,
    roleId: user.roleId,
    phone: user.phone,
  });
});

function createRandomUser() {
  return {
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: hashPassword("123456"),
    roleId: 3,
    gender: Math.random > 0.5 ? "true" : "false",
    phone: "0" + faker.string.numeric(9),
    fullName: faker.person.fullName(),
    address: faker.location.streetAddress({ useFullAddress: true }),
  };
}

const USERS = faker.helpers.multiple(createRandomUser, {
  count: 40,
});

USERS.forEach(async (user) => {
  await db.User.create({
    email: user.email,
    avatar: user.avatar,
    password: user.password,
    roleId: user.roleId,
    fullName: user.fullName,
    address: user.address,
    roleId: user.roleId,
    phone: user.phone,
  });
});

function createRandomPet() {
  return {
    user_id: faker.number.int({ min: 1, max: 40 }),
    name_pet: faker.animal.dog(),
    breed: faker.animal.dog({ breed: true }),
    date_of_birth: faker.date.past(),
    weight: faker.number.int({ min: 1, max: 50 }),
    photo: faker.image.avatar(),
    is_neutered: faker.helpers.arrayElement([true, false]),
  };
}

const PETS = faker.helpers.multiple(createRandomPet, {
  count: 20,
});

PETS.forEach(async (user) => {
  await db.Pet.create({
    user_id: user.user_id,
    name_pet: user.name_pet,
    breed: user.breed,
    date_of_birth: user.date_of_birth,
    weight: user.weight,
    photo: user.photo,
    is_neutered: user.is_neutered,
    species: 1,
  });
});
function createRandonFeedback() {
  return {
    user_id: faker.number.int({ min: 1, max: 40 }),
    point: faker.number.float({ min: 1, max: 5 }),
    comment: faker.lorem.sentence(),
    service_id: faker.number.int({ min: 1, max: 10 }),
    booking_id: faker.number.int({ min: 1, max: 10 }),
  };
}

const FEEDBACKS = faker.helpers.multiple(createRandonFeedback, {
  count: 40,
});

FEEDBACKS.forEach(async (feedback) => {
  await db.Feedback.create({
    user_id: feedback.user_id,
    point: feedback.point,
    comment: feedback.comment,
    service_id: feedback.service_id,
    booking_id: feedback.booking_id,
    rating_type: "SERVICE",
  });
});

// function createRandonBooking() {
//   return {
//     user_id: faker.number.int({ min: 1, max: 40 }),
//     service_id: faker.number.int({ min: 1, max: 10 }),
//     pet_id: faker.number.int({ min: 1, max: 40 }),
//     date: faker.date.recent(),
//     start_time: faker.date.anytime({ min: "09:00", max: "15:00" }),
//     end_time: faker.date.anytime({ min: "10:00", max: "14:00" }),
//     status: faker.helpers.arrayElement([
//       "pending",
//       "confirmed",
//       "cancelled",
//       "completed",
//     ]),
//   };
// }

// const BOOKINGS = faker.helpers.multiple(createRandonBooking, {
//   count: 1,
// });

// BOOKINGS.forEach(async (booking) => {
//   await db.Feedback.create({
//     user_id: booking.user_id,
//     service_id: booking.service_id,
//     pet_id: booking.pet_id,
//     date: booking.date,
//     start_time: booking.start_time,
//     end_time: booking.end_time,
//     status: booking.status,
//   });
// });

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
