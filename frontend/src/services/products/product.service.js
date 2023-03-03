import axios from "axios";
import FormData from "form-data";

export const createProductRequest = ({
  user,
  name,
  price,
  quantityInStock,
  isDigital,
  description,
  category,
  tags,
  images,
  imageNames,
  files,
  fileNames,
  parcelLength,
  parcelWidth,
  parcelHeight,
  parcelWeight,
}) => {
  console.log("createProductRequest: user: ", user, 
    ", name: ", name, ", price: ", price, ", quantityInStock: ", quantityInStock,
    ", isDigital: ", isDigital, ", description: ", description, ", category: ", category,
    ", tags: ", tags, ", images: ", images, ", imageNames: ", imageNames, ", files: ", files,
    ", fileNames: ", fileNames, ", parcelLength: ", parcelLength, "parcelWidth: ", parcelWeight,
    ", parcelHeight: ", parcelHeight, ", parcelWeight: ", parcelWeight
  )
  return new Promise(async (resolve, reject) => {
    //first determine how many items the user currently has in their store
    // if (user.products.length < 40) {
    var bodyFormData = new FormData();
    const tagsStr = JSON.stringify(tags);
    bodyFormData.append("user", user);
    bodyFormData.append("name", name);
    bodyFormData.append("price", price);
    bodyFormData.append("isDigital", isDigital);
    bodyFormData.append("description", description);
    bodyFormData.append("category", category);
    bodyFormData.append("tags", tagsStr);
    if (quantityInStock)
      bodyFormData.append("quantityInStock", quantityInStock);
    if (images && images.length > 0) {
      bodyFormData.append("imageNames", JSON.stringify(imageNames));
      for (let i = 0; i < images.length; i++) {
        bodyFormData.append(`image${i}`, images[i]);
      }
    }
    if (files && files.length > 0) {
      bodyFormData.append("fileNames", JSON.stringify(fileNames));
      for (let i = 0; i < files.length; i++) {
        bodyFormData.append(`file${i}`, files[i]);
      }
    }
    if (parcelLength && parcelWidth && parcelHeight && parcelWeight) {
      bodyFormData.append("parcelLength", parcelLength);
      bodyFormData.append("parcelWidth", parcelWidth);
      bodyFormData.append("parcelHeight", parcelHeight);
      bodyFormData.append("parcelWeight", parcelWeight);
    }
    axios({
      method: "post",
      url: `/products/create`,
      data: bodyFormData,
    })
      .then(() => {
        console.log("success");
        resolve();
      })
      .catch((e) => {
        console.log(e);
        reject();
      });
  });
};

export const getAllProducts = () => {
  return axios.get(`/products`);
};

export const getUserProducts = (uid) => {
  return axios.get(`/products/${uid}`);
};

export const getProduct = (id) => {
  return axios.get(`/find_product/${id}`);
};
