import user from "./userRoute";
import auth from "./authRoute";
import role from "./roleRoute";
import pet from "./petRoute";
import booking from "./bookingRoute";
import vaccine from "./vaccineRoute";
import insert from "./insertRoute";
import medicalRecord from "./medicalRecordRoute";
import medicine from "./medicineRoute";

const initRoutes = (app) => {
  app.use("/api/v1/users", user);
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/roles", role);
  app.use("/api/v1/pets", pet);
  // app.use("/api/v1/booking", booking);
  app.use("/api/v1/medicine", medicine);
  app.use("/api/v1/vaccine", vaccine);
  app.use("/api/v1/medicalRecord", medicalRecord);

  app.use("/api/v1/insert", insert);
};

export default initRoutes;
