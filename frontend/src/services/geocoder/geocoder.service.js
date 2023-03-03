import axios from "axios";
const basicURL = process.env.REACT_APP_BACKEND_URL;

export const geocodeRequest = (addressObj) => {
	console.log("geocodeRequst: addressObj -> ", addressObj);
	return new Promise(async (resolve, reject) => {
		try {
			const res = await axios.post(`${basicURL}/geocode`, addressObj);
			resolve(res.data);
		} catch (e) {
			reject(e);
		}
	});
};
