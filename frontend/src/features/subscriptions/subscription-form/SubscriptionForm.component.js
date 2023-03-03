import React, { useContext, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { AuthenticationContext } from "../../../services/authentication/authentication.context";
import { SubscriptionsContext } from "../../../services/subscriptions/subscriptions.context";
import { ContentBox } from "../../../components/content-box/ContentBox.component";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
const basicURL = process.env.REACT_APP_BACKEND_URL;

const blockInvalidChar = (e) =>
	["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

const SubscriptionInnerForm = ({ clientSecret }) => {
	const { user, setIsAuthenticated, isAuthenticated, setUser } = useContext(
		AuthenticationContext
	);
	const { planType, setPlan } = useContext(SubscriptionsContext);
	const initialvalues = { cc: "", cvv: "", expire: "" };
	const [isresult, setResult] = useState({});
	const [isSubscription, setResultSubscription] = useState({});
	const [isSubmit, setIsSubmit] = useState(false);
	const [formValues, setFormValues] = useState(initialvalues);
	const [formErrors, setFormErrors] = useState({});
	const { cc, cvv, expire } = formValues;
	let pricePlan = "";
	if (planType === "monthly") {
		pricePlan = "32.59";
	} else if (planType === "yearly") {
		pricePlan = "271.56";
	} else {
		pricePlan = "1629.38";
	}

	let history = useHistory();
	const registerRequestUpdate = (userObj) => {
		return new Promise(async (resolve, reject) => {
			try {
				const res = await axios.post(`${basicURL}/register_update`, {
					...userObj,
				});
				const { user } = res.data;
				resolve(user);
			} catch (e) {
				reject(e);
			}
		});
	};
	const checkoutmethod = async (data) => {
		return new Promise(async (resolve, reject) => {
			try {
				const res = await axios.post(`${basicURL}/checkout-method`, {
					cc: data.cc,
					cvv: data.cvv,
					expire: data.expire,
					amount: pricePlan,
					messages: data?.messages,
					subscriptionId: data?.subscriptionId,
					profile: data?.profile,
					user: user._doc,
					///////// user Info/////
					type: user.type,
					category: user.category,
					cell: user.cell,
					city: user.city,
					country: user.country,
					createdAt: user.createdAt,
					displayName: user.displayName,
					email: user.email,
					fname: user.fname,
					lat: user.lat,
					lname: user.lname,
					lng: user.lng,
					paymentFailed: user.paymentFailed,
					postalCode: user.postalCode,
					profileUrl: user.profileUrl,
					secret: user.secret,
					stateOrProvince: user.stateOrProvince,
					streetAddressLine1: user.streetAddressLine1,
					stripeAccountID: user.stripeAccountID,
					stripeCustomerID: user.stripeCustomerID,
				});
				console.log("response for checkout", res?.data);
				setIsAuthenticated(true);
				setUser({ ...user, accountActive: true });
				resolve(setResult(res?.data));
			} catch (e) {
				reject(setResult(e));
				toast.error(e.message);
			}
		});
	};

	// useEffect(() => {
	//   registerRequestUpdate(user ? user : user._doc);
	// },);
	useEffect(() => {
		if (isresult?.messages?.resultCode === "Ok") {
			toast.success(`$${pricePlan} has been Deducted from Credit Card.`);
			console.log(user, "tayayayayyayab");
			// registerRequestUpdate(user)
			setTimeout(() => {
				history.push("/");
			}, 2000);
		}
		if (isSubscription?.messages?.resultCode === "Error") {
			toast.warning(isSubscription?.messages?.message[0]?.text);
		}
	}, [isresult]);
	const createSubscription = async (infoData) => {
		return new Promise(async (resolve, reject) => {
			try {
				const res = await axios.post(
					`${basicURL}/create-subscription-authorize`,
					{
						cc: infoData.cc,
						cvv: infoData.cvv,
						expire: infoData.expire,
						amount: pricePlan,
						planType: planType,
						user: user._doc,
						///////user Info///////
						type: user.type,
						category: user.category,
						cell: user.cell,
						city: user.city,
						country: user.country,
						createdAt: user.createdAt,
						displayName: user.displayName,
						email: user.email,
						fname: user.fname,
						lat: user.lat,
						lname: user.lname,
						lng: user.lng,
						paymentFailed: user.paymentFailed,
						postalCode: user.postalCode,
						profileUrl: user.profileUrl,
						expirationDate: "never",
						secret: user.secret,
						stateOrProvince: user.stateOrProvince,
						streetAddressLine1: user.streetAddressLine1,
						stripeAccountID: user.stripeAccountID,
						stripeCustomerID: user.stripeCustomerID,
					}
				);
				resolve(setResultSubscription(res.data));
				console.log("create-payment-authorize!!!!")
			} catch (e) {
				console.log(e);
				reject(setResultSubscription(e));
			}
		});
	};

	const handleOnChange = (e) => {
		const { name, value } = e.target;
		setFormValues({
			...formValues,
			[name]: value,
		});
	};

	const handleSubmit = async (event) => {
		// We don't want to let default form submission happen here,
		// which would refresh the page.
		event.preventDefault();
		const data = {
			cc: cc,
			cvv: cvv,
			expire: expire,
			amount: pricePlan,
		};

		if (data) {
			setFormErrors(validate(formValues));
			setIsSubmit(true);
		}
	};

	useEffect(() => {
		if (Object.keys(formErrors).length === 0 && isSubmit) {
			createSubscription(formValues);
		}
		if (isSubscription?.messages?.resultCode === "Error") {
			toast.warning(isSubscription?.messages?.message[0]?.text);
		}
	}, [formErrors]);

	const validate = (values) => {
		const errors = {};

		var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
		var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
		var amexpRegEx = /^(?:3[47][0-9]{13})$/;
		var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
		var isValid = false;
		if (!values.cc) {
			errors.cc = "cc is required!";
		}
		if (visaRegEx.test(values.cc)) {
			isValid = true;
		} else if (mastercardRegEx.test(values.cc)) {
			isValid = true;
		} else if (amexpRegEx.test(values.cc)) {
			isValid = true;
		} else if (discovRegEx.test(values.cc)) {
			isValid = true;
		}

		if (isValid) {
		} else {
			errors.cc = "Invalid cc code.";
		}

		if (!values.cvv) {
			errors.cvv = "cvv is required!";
		} else if (!/^\d{3}$/.test(values.cvv)) {
			errors.cvv = "Invalid CVV code.";
		}
		if (!values.expire) {
			errors.expire = "Expire is required!";
		} else if (!/^\d{4}$/.test(values.expire)) {
			errors.expire = "Invalid expiration date.";
		}

		return errors;
	};

	useEffect(() => {
		const checkOutData = {
			cc: cc,
			cvv: cvv,
			expire: expire,
			amount: pricePlan,
			messages: isSubscription?.messages,
			subscriptionId: isSubscription?.subscriptionId,
			profile: isSubscription?.profile,
		};
		if (isSubscription?.messages?.resultCode === "Ok") {
			toast.success(`Your ${planType} plan has been subscribed.`);
			checkoutmethod(checkOutData);
		}
		if (isSubscription?.messages?.resultCode === "Error") {
			toast.warning(isSubscription?.messages?.message[0]?.text);
		}
	}, [isSubscription]);
	console.log("userdata", JSON.stringify(user));
	return (
		<form
			onSubmit={handleSubmit}
			style={{ width: "800px", maxWidth: "99vw", marginTop: "80px" }}
		>
			<ContentBox titleText="Checkout" titlePosition="right">
				<div
					style={{
						marginTop: "10px",
						width: "100%",
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					<h3 style={{ color: "white", fontFamily: "Noto Sans Display" }}>
						1x CreativeU{" "}
						{(() => {
							switch (planType) {
								case "monthly":
									return "Monthly";
								case "yearly":
									return "Yearly";
								case "lifetime":
									return "Lifetime";
								case "artistpack":
									return "Artist Pack";
								default:
									return "ERROR";
							}
						})()}{" "}
						Plan
					</h3>
					<h3 style={{ color: "white", fontFamily: "Noto Sans Display" }}>
						{(() => {
							switch (planType) {
								case "monthly":
									return "$32.59 / month*";
								case "yearly":
									return "$271.56 / year*";
								case "lifetime":
									return "$1,629.38 (one time payment)*";
								case "artistpack":
									return "$1 (for three months, select a plan after that)*";
								default:
									return "ERROR";
							}
						})()}{" "}
					</h3>
				</div>
				<p style={{ color: "white", fontFamily: "Noto Sans Display" }}>
					*Includes sales tax {user.accountVerified ? "true" : "false"}
				</p>
				<h3 style={{ color: "white", fontFamily: "Noto Sans Display" }}>
					Payment Information
				</h3>
				<div style={{ backgroundColor: "white", padding: "20px" }}>
					<div className="form-control">
						<label for="cc">Credit Card Number:</label>
						<input
							type="number"
							id="cc"
							name="cc"
							placeholder="4242424242424242"
							className="form-control w-100"
							value={cc}
							onKeyDown={blockInvalidChar}
							maxLength={16}
							// required
							onChange={handleOnChange}
						/>
					</div>
					<p style={{ color: "red" }}>{formErrors?.cc}</p>
					<br />
					<div className="form-control">
						<label for="cvv">Credit Card Code:</label>
						<input
							type="number"
							id="cvv"
							name="cvv"
							placeholder="CVV"
							className="form-control"
							onKeyDown={blockInvalidChar}
							value={cvv}
							maxLength={3}
							onChange={handleOnChange}
						/>
					</div>
					<p style={{ color: "red" }}>{formErrors?.cvv}</p>
					<br />
					<div className="form-control">
						<label for="expire">Expiration Date (mmyy):</label>
						<input
							type="number"
							id="expire"
							name="expire"
							placeholder="mmyy"
							className="form-control"
							value={expire}
							maxLength={4}
							onKeyDown={blockInvalidChar}
							onChange={handleOnChange}
						/>
					</div>
					<p style={{ color: "red" }}>{formErrors?.expire}</p>
					<br />
					{/* <PaymentElement /> */}
				</div>
				<button
					// disabled={!isEnabled}
					className="form-control"
					style={{ marginTop: "40px" }}
					id="stripe-payment-button"
				>
					Submit
				</button>
				<ToastContainer position="bottom-right" newestOnTop />
			</ContentBox>
		</form>
	);
};

export const SubscriptionForm = ({ planRef }) => {
	const stripePromise = loadStripe(
		"pk_test_51MMQs0HXnCGRiN0ao6Gd3d4zahjjsaDJBGxXdULHcPgqZhN9oMbvu0Nf0Wuez0qdEcbsD4TjFIfZCPpIaLTuqI3n00eU6NHVeb"
	);

	const { clientSecret } = useContext(SubscriptionsContext);
	const options = {
		clientSecret,
	};
	return (
		<Elements stripe={stripePromise} options={options}>
			<SubscriptionInnerForm clientSecret={clientSecret} planRef={planRef} />
		</Elements>
	);
};
