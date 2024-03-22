import dataPetServices from "./petService.json";
import dataVaccines from "./vaccine.json";
import dataRoles from "./role.json";
import db from "../models";

require("../dbs/connect_DB");

dataRoles.forEach(async (role) => {
  await db.Role.create({
    name_role: role.name_role,
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
