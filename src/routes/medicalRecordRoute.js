import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";
import { isVeterinarian } from "../middlewares/verify_roles";

const router = express.Router();

router.use(verifyToken);
router.get("/get-records-of-user", controllers.getRecordsOfUser);
router.get("/get-record-of-pet/:petId", controllers.getRecordOfPet);

router.use(isVeterinarian);
router.post("/create-record", controllers.createRecord);
router.put("/update-record/:recordId", controllers.updateRecord);

module.exports = router;
