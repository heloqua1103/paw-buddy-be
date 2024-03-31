import axios from "axios";

export const getBreed = ({ limit, page, order, ...query }) =>
  new Promise(async (resolve, reject) => {
    try {
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const fLimit = +limit || +process.env.LIMIT_BREED;
      const data = await axios
        .get("https://api.thedogapi.com/v1/breeds", {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
          params: {
            limit: fLimit,
            page: offset,
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
        success: data ? true : false,
        message: data ? "Successfully" : "Something went wrong",
        data: breeds,
      });
    } catch (error) {
      reject(error);
    }
  });
