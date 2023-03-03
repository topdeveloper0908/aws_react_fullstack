import axios from "axios";

export const checkUris = (uris) => {
  console.log("checkUris: uris: ", uris);
  return new Promise(async (resolve, reject) => {
    //stringify the uri array to send in the body
    // const stringifiedURIs = JSON.stringify(uris);
    try {
      const res = await axios.post("/check_uris", { uris });
      const threats = res.data;
      if (threats.length === 0) resolve();
      else reject({ threats });
    } catch (error) {
      reject({ error });
    }
  });
};
