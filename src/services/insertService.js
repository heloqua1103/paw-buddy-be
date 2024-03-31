import axios from "axios";
import db from "../models";

export const test = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      const data = await axios
        .get("https://api.thedogapi.com/v1/breeds", {
          headers: {
            "x-api-key":
              "live_hWLw1JXcmuQClo9t7sNpIAsFDe3F9yB9kEmuNXJsMxvux8pF0rEOUCgJnhdhiF5o",
          },
          params: {
            limit: 2,
            page: 0,
          },
        })
        .then((res) => res.data)
        .catch((error) => console.log(error));
      const breeds = data.map((item) => ({
        id: item.id,
        name: item.name,
        life_span: item.life_span,
        weight: item.weight,
        height: item.height,
        image: item.image.url,
      }));
      resolve({
        message: "Data inserted successfully",
        data: breeds,
      });
    } catch (error) {
      reject(error);
    }
  });
