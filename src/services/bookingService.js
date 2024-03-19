// import db from "../models";

// export const createBooking = (userId, body) =>
//   new Promise(async (resolve, reject) => {
//     try {
//       const result = await db.Booking.create({
//         ...body,
//         userId,
//       });
//       resolve({
//         success: result ? true : false,
//         message: result ? "Create pet successfully" : "Create pet failed",
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
