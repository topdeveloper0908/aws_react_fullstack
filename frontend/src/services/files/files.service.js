import axios from "axios";

const basicURL = process.env.REACT_APP_BACKEND_URL;
// const basicURL = "http://localhost:8080";
export const uploadRequest = (email, filename, file, field) => {
  console.log("uploadRequest: email -> ", email, ", filename: ", filename, ", file: ", file, ", field: ", field);
  return new Promise(async (resolve, reject) => {
    //remove spaces from filename
    let fn = filename;
    if (fn.includes(" ")) {
      fn = fn.split(" ").join("_");
    }
    var bodyFormData = new FormData();
    console.log('wefgweufg', email, fn, field)
    bodyFormData.append("email", email);
    bodyFormData.append("filename", fn);
    bodyFormData.append("file", file);
    bodyFormData.append("field", field);
    axios({
      method: "post",
      url: `${basicURL}/api/files/upload`,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const mediaUploadRequest = (
  filename,
  file,
  mediaType,
  title,
  fileType
) => {
  console.log("mediaUploadRequest: filename -> ", filename, ", file: ", file, ", mediaType: ", mediaType, ", title:", title, ", fileType: ", fileType);
  return new Promise(async (resolve, reject) => {
    //remove spaces from filename
    let fn = filename;
    if (fn.includes(" ")) {
      fn = fn.split(" ").join("_");
    }
    var bodyFormData = new FormData();
    bodyFormData.append("filename", fn);
    bodyFormData.append("file", file);
    bodyFormData.append("mediaType", mediaType);
    bodyFormData.append("title", title);
    bodyFormData.append("fileType", fileType);
    axios({
      method: "post",
      url: `${basicURL}/api/media/upload`,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        console.log("Successfully uploaded media");
        console.log(res);
        console.log(res.data);
        resolve(res.data);
      })
      .catch((e) => {
        console.log("Failed to upload media:");
        console.log(e);
        reject(e);
      });
  });
};

export const mediaDeleteRequest = (url, mediaType) => {
  console.log("mediaDeleteRequest: url -> ", url, ", mediaType: ", mediaType);
  return new Promise((resolve, reject) => {
    axios
      .delete(`${basicURL}/api/media/delete`, { data: { url, mediaType } })
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e);
      });
  });
};
