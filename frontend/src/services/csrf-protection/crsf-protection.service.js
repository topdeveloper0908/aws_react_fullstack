import axios from "axios";

const basicURL = process.env.REACT_APP_BACKEND_URL;

export const getCSRFToken = async () => {
  console.log("getCSRFToken");
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${basicURL}/csrftoken`);
      console.log("responseCSRF", response);
      axios.defaults.headers.common["X-CSRF-Token"] = response.data.CSRFToken;
      console.log("response.data.CSRFToken", response.data.CSRFToken);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
