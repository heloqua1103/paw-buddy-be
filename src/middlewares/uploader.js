const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const petStorage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png"],
  params: {
    folder: "PB_pet",
  },
});

const userStorage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png"],
  params: {
    folder: "PB_user",
  },
});

const serviceStorage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png"],
  params: {
    folder: "PB_service",
  },
});

const breedStorage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png"],
  params: {
    folder: "PB_breed",
  },
});

const uploadPet = multer({ storage: petStorage });
const uploadUser = multer({ storage: userStorage });
const uploadService = multer({ storage: serviceStorage });
const breedService = multer({ storage: breedStorage });

module.exports = {
  uploadPet,
  uploadUser,
  uploadService,
  breedService,
};
