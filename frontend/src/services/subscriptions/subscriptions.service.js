import axios from "axios";
const basicURL = process.env.REACT_APP_BACKEND_URL;

export const createSubscription = async (customerId, priceId) => {
	// console.log(customerId, priceId, "customerId, priceId");
	console.log("CustomerID: ", customerId);
	console.log("priceID: ", priceId);

	return new Promise(async (resolve, reject) => {
		try {
			const res = await axios.post(
				`${basicURL}/payments/create-subscription`,
				{
					customerId,
					priceId,
				}
				// { headers: headers }
			);
			console.log("CreateSubscription: ")
			resolve({
				subscriptionId: res.data.subscriptionId,
				clientSecret: res.data.clientSecret,
			});
		} catch (e) {
			reject(e);
		}
	});
};

export const createLifetimeMembershipPaymentIntent = async (customerId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const res = await axios.post(
				`${basicURL}/payments/create-lifetime-membership`,
				{
					customerId,
				}
			);
			console.log("createLifetimeMembershipPaymentIntent");
			resolve({
				clientSecret: res.data.clientSecret,
			});
		} catch (e) {
			reject(e);
		}
	});
};

export const createAPMembershipPaymentIntent = (customerId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const res = await axios.post(
				`${basicURL}/payments/create-ap-membership`,
				{
					customerId,
				}
			);
			console.log("createAPMembershipPaymentIntent");
			resolve({
				clientSecret: res.data.clientSecret,
			});
		} catch (e) {
			reject(e);
		}
	});
};
