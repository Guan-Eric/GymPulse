import axios from "axios";

const baseUrl = "https://exercisedb.p.rapidapi.com";

const apiCall = async (url, params) => {
  try {
    const options = {
      method: "GET",
      url,
      params,
      headers: {
        "X-RapidAPI-Key": "31c8c367f7mshefa2d05ca56c1d2p122023jsn137ea50f9183",
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
      },
    };
    const response = await axios.request(options);
    return response.data;
  } catch (err) {
    console.log(err.message);
  }
};

export const fetchExerciseByBodyPart = async (bodyPart) => {
  let data = await apiCall(baseUrl + "/exercises/bodyPart/" + bodyPart);
  return data;
};
