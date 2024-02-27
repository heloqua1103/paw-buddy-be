import db from "../models";

// export const createUser = (body) =>
//   new Promise(async (resolve, reject) => {
//     try {
//       const user = await db.User.findOrCreate({
//         where: { username: body.username, password: body.password },
//       });
//       resolve({
//         err: user[1] ? true : false,
//         message: user[1] ? "User created" : "User already exists",
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
