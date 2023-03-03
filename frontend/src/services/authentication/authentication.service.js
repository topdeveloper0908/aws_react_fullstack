import axios from "axios";

const basicURL = process.env.REACT_APP_BACKEND_URL;

console.log("basicURL", basicURL);

export const registerRequest = (userObj) => {
	console.log("registerRequest: userOBj ->", userObj);
	return new Promise(async (resolve, reject) => {
		try {
			const res = await axios.post(`${basicURL}/register`, {
				...userObj,
			});
			const { user } = res.data;
			console.log("res.data", res.data);
			resolve(user);
		} catch (e) {
			reject(e);
		}
	});
};

export const loginRequest = (email, password) => {
	console.log("loginRequest: email ->", email, ", password ->", password);
	return new Promise((resolve, reject) => {
		axios
			.post(`${basicURL}/login`, { email, password })
			.then((res) => {
				const { user } = res.data;
				console.log(
					"request has been made thrugh loginRequest function /login",
					user
				);
				resolve(user);
			})
			.catch((e) => {
				// console.log("error thrugh loginRequest function /login", e);
				reject(e);
			});
	});
};

export const checkForUser = () => {
	console.log("checkForUser: -> ");
	return new Promise(async (resolve, reject) => {
		axios
			.get(`${basicURL}/authenticated_user`)
			.then((res) => {
				const user = res.data;
				console.log("received user data on frontend", res.data);
				resolve(user);
			})
			.catch((e) => {
				console.log("received err", e);

				reject(e);
			});
	});
};

export const checkForMod = () => {
	console.log("checkForMod: -> ");
	return new Promise(async (resolve, reject) => {
		axios
			.post(`${basicURL}/authenticated_mod`)
			.then((res) => {
				const user = res.data;
				resolve(user);
			})
			.catch((e) => {
				reject(e);
			});
	});
};

export const emailInUse = (email) => {
	console.log(email, "email");
	return new Promise(async (resolve, reject) => {
		try {
			const res = await axios.post(`${basicURL}/validate_email`, {
				email,
			});
			if (res.data.user) {
				console.log("res.data.user: ", res.data.user);
				resolve(true);
			}
			else resolve(false);
		} catch (e) {
			reject(e);
		}
	});
};

export const profileUrlInUse = (url) => {
	console.log("profileUrlInUse: url -> ", url);
	return new Promise(async (resolve, reject) => {
		try {
			const res = await axios.post(`${basicURL}/validate_url`, { url });
			if (res.data.user) resolve(true); //url is in use
			else resolve(false);
		} catch (e) {
			reject(e);
		}
	});
};

export const logoutRequest = () => {
	console.log("logoutRequest: -> ");
	return new Promise(async (resolve, reject) => {
		try {
			await axios.delete(`${basicURL}/logout`);
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};

export const updateRequest = (fieldValuePairs) => {
	console.log("updateRequest: fieldValuePairs-> ", fieldValuePairs);
	return new Promise(async (resolve, reject) => {
		try {
			const res = await axios.put(`${basicURL}/authenticated_user`, {
				fieldValuePairs,
			});
			const updatedUser = res.data;
			resolve(updatedUser);
		} catch (e) {
			reject(e);
		}
	});
};

export const deleteRequest = () => {
	console.log("deleteRequest: -> ");
	return new Promise(async (resolve, reject) => {
		try {
			const deleted = await axios.delete(`${basicURL}/cancel_subscription`);
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};

export const refreshEventRequests = () => {
	console.log("refreshEventRequests: -> ");
	return new Promise(async (resolve, reject) => {
		try {
			const res = await axios.get(`${basicURL}/api/event_requests`);
			resolve(res.data);
		} catch (e) {
			reject(e);
		}
	});
};

export const requestPasswordReset = (email) => {
	console.log("requestPasswordReset: email -> ", email);
	return new Promise(async (resolve, reject) => {
		await axios.post(`${basicURL}/request_password_reset`, { email });
		//this will always resolve
		resolve();
	});
};

export const resetPassword = (password, resetCode) => {
	console.log("resetPassword: password -> ", password, ", resetCode", resetCode);
	return new Promise(async (resolve, reject) => {
		try {
			await axios.put(`${basicURL}/reset_password`, { password, resetCode });
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};

export const loginRequestMod = (email, password) => {
	console.log("loginRequestMod: email -> ", email, ", password", password);
	return new Promise((resolve, reject) => {
		axios
			.post(`${basicURL}/login_mod`, { email, password })
			.then((res) => {
				const { user } = res.data;
				resolve(user);
			})
			.catch((e) => {
				reject(
					"Authentication failed. Please check that your email and password are entered correctly."
				);
			});
	});
};

export const logoutRequestMod = () => {
	console.log("logoutRequestMod: ->");
	return new Promise(async (resolve, reject) => {
		try {
			await axios.delete(`${basicURL}/logout_mod`);
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};

export const refreshMessageThreads = () => {
	console.log("refreshMessageThreads: ->");
	return new Promise(async (resolve, reject) => {
		try {
			const res = await axios.get(`${basicURL}/messagethreads`);
			resolve(res.data);
		} catch (e) {
			reject(e);
		}
	});
};

export const toggleBlockedStatus = (otherPartyID) => {
	console.log("toggleBlockedStatus: otherPartyID ->", otherPartyID);
	return new Promise(async (resolve, reject) => {
		try {
			const res = await axios.put(`${basicURL}/change_blocked_status`, {
				otherPartyID,
			});
			resolve(res.data);
		} catch (e) {
			reject(e);
		}
	});
};

export const reportUser = (otherParty, reason) => {
	console.log("reportUser: otherParty ->", otherParty, ", reason", reason);
	return new Promise(async (resolve, reject) => {
		try {
			const res = await axios.post(`${basicURL}/report_user`, {
				otherParty,
				reason,
			});
			resolve(res.data);
		} catch (e) {
			reject(e);
		}
	});
};
