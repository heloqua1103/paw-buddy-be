import db from "../models";

export const createBooking = (userId, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const duration = await db.PetService.findOne({
        where: { id: +body.service_id },
        attributes: ["estimated_duration"],
      });
      // Chuyển đổi thành số nguyên
      const [hours, minutes, seconds] = body.start_time.split(":").map(Number);
      // Cộng thêm 30 phút
      const newMinutes = minutes + duration.dataValues.estimated_duration;

      // Xử lý nếu phút vượt quá 60
      if (newMinutes >= 60) {
        hours++;
        newMinutes -= 60;
      }

      // Định dạng lại giờ và phút
      const newTimeString = `${hours.toString().padStart(2, "0")}:${newMinutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      console.log(newTimeString);
      //   const result = await db.Booking.create({
      //     ...body,
      //     user_id: userId,
      //   });
      resolve({
        success: duration ? true : false,
        message: duration ? "Create pet successfully" : "Create pet failed",
      });
    } catch (error) {
      reject(error);
    }
  });
