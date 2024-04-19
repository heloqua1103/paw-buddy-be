const dataVaccines = require("./vaccine.json");
const dataPetServices = require("./petService.json");
const dataMedicines = require("./medicineData.json");
const dataRoles = require("./role.json");
const dataServiceCategory = require("./serviceCategoryData.json");
const dataUsers = require("./userData.json");
const db = require("../models");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const hashPassword = (password) => bcrypt.hashSync(password, salt);

require("../dbs/connect_DB");

dataRoles.forEach(async (role) => {
  await db.Role.create({
    name_role: role.name_role,
  });
});

dataUsers.forEach(async (user) => {
  await db.User.create({
    email: user.email,
    password: hashPassword("123456"),
    roleId: Math.random() > 0.5 ? 2 : 3,
  });
});

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
