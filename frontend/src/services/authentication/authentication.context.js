import React, { useState, useEffect, createContext } from "react";
import {
	registerRequest,
	loginRequest,
	checkForUser,
	checkForMod,
	logoutRequest,
	updateRequest,
	deleteRequest,
	refreshEventRequests,
	loginRequestMod,
	logoutRequestMod,
	refreshMessageThreads,
	toggleBlockedStatus,
	reportUser,
} from "./authentication.service";
import { getEventsAndCalendar } from "../calendar/calendar.service";
import newMessageSound from "../../assets/sounds/new-message.wav";

export const AuthenticationContext = createContext();

export const AuthenticationContextProvider = ({ children }) => {
	
	//unauthenticated states
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [userType, setUserType] = useState(null);
	const [userLocation, setUserLocation] = useState(null);
	const { localStorage } = window;

	//authenticated states
	const [user, setUser] = useState(null);
	const [mod, setMod] = useState(null);
	const [eventRequests, setEventRequests] = useState([]);
	const [messageThreads, setMessageThreads] = useState([]);
	const [unreadMessages, setUnreadMessages] = useState({
		count: 0,
		unreadIDs: [],
	});
	const [websocket, setWebsocket] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isAuthenticatedMod, setIsAuthenticatedMod] = useState(false);

	const countAndAggregateUnreadMessages = (threads, userID) => {
		let count = 0;
		let unreadIDs = [];
		if (threads && threads.length > 0) {
			threads.forEach((thread) => {
				const numberOfUnreadMessages = thread.messages.filter((m) => {
					return !m.read && m.senderID !== userID;
				}).length;
				count += numberOfUnreadMessages;
				if (numberOfUnreadMessages > 0) {
					unreadIDs.push(thread._id);
				}
			});
		}
		return {
			count,
			unreadIDs,
		};
	};

	//unauthenticated functions
	useEffect(() => {
		if (userType) {
			console.log("usertype in context", userType);
		}
		const onGeolocateSuccess = (pos) => {
			const userLoc = {
				lat: pos.coords.latitude,
				lng: pos.coords.longitude,
			};
			localStorage.setItem("userLocation", JSON.stringify(userLoc));
			setUserLocation(userLoc);
		};

		const onGeolocateError = (err) => {
			return;
		};

		const storedUserType = localStorage.getItem("userType");
		if (storedUserType) {
			setUserType(storedUserType);
		}
		const storedUserLocation = localStorage.getItem("userLocation");
		if (storedUserLocation) setUserLocation(JSON.parse(storedUserLocation));
		navigator.geolocation.getCurrentPosition(
			onGeolocateSuccess,
			onGeolocateError
		);

		(async () => {
			setIsLoading(true);
			try {
				const u = await checkForUser();
				if (u) {
					let calendar, events;
					try {
						const eventsAndCalendar = await getEventsAndCalendar(u._id);
						calendar = eventsAndCalendar.calendar;
						events = eventsAndCalendar.events;
					} catch (e) {
						setError("Problem loading the calendar");
						calendar = {};
						events = [];
					}
					//create a websocket client
					if (!websocket) {
						const socketProtocol =
							window.location.protocol === "https:" ? "wss:" : "ws:";
						const socketUrl = socketProtocol + "//localhost:8080/connect"      //"//creativeu-app.live/connect"; //+ "localhost:4242/connect"; for development
						const socket = new WebSocket(socketUrl);

						socket.userID = u._id;

						socket.onopen = () => {
							socket.send(`initial_connection ${u._id}`);
						};

						socket.onmessage = (e) => {
							if (e.data === "new event request action") {
								refreshEventRequests()
									.then((updatedRequests) => {
										setEventRequests(updatedRequests);
										const newMessageAudio =
											document.getElementById("newMessageAudio");
										newMessageAudio.play();
									})
									.catch((e) => {
										console.log(e);
									});
							} else if (e.data === "new message received") {
								refreshMessageThreads()
									.then((updatedThreads) => {
										setMessageThreads(updatedThreads);
										setUnreadMessages(
											countAndAggregateUnreadMessages(
												updatedThreads,
												socket.userID
											)
										);
										const newMessageAudio =
											document.getElementById("newMessageAudio");
										newMessageAudio.play();
									})
									.catch((e) => {
										console.log(e);
									});
							}
						};

						setWebsocket(socket);
						setEventRequests(u.eventRequests);
						setMessageThreads(u.messageThreads);
						setUnreadMessages(
							countAndAggregateUnreadMessages(u.messageThreads, u._id)
						);
						delete u.messageThreads;
						delete u.eventRequests;
						setUser({ ...u, calendar, events });
						console.log("authenticating in useeffect", u);
						setIsAuthenticated(true);
					}
				}
			} catch (e) {
				//check for a mod
				console.log("catch", e);
				try {
					const mod = await checkForMod();
					setMod(mod);

					setIsAuthenticatedMod(true);
				} catch (e) {
					//do nothing
				}
			}
		})();
	}, [localStorage, userType]);

	const changeUserType = (uType) => {
		console.log("changeUserType", uType);
		setUserType(uType);
		localStorage.setItem("userType", uType);
	};

	const onRegister = (userObj) => {
		console.log("onRegister", userObj);
		return new Promise((resolve, reject) => {
			//if the user is logged in, immediately reject
			if (isAuthenticated || isAuthenticatedMod)
				reject(new Error("Logout in order to register."));
			registerRequest(userObj)
				.then((u) => {
					setUser({ ...u, calendar: {}, events: [] });
					setIsAuthenticated(true);
					//create a websocket client
					if (!websocket) {
						const socketProtocol =
							window.location.protocol === "https:" ? "wss:" : "ws:";
						const socketUrl = socketProtocol + "//localhost:8080/connect"//"//creativeu-app.live/connect"; //+ "localhost:4242/connect";
						const socket = new WebSocket(socketUrl);

						socket.userID = u._id;

						socket.onopen = () => {
							socket.send(`initial_connection ${u._id}`);
						};

						socket.onmessage = (e) => {
							if (e.data === "new event request action") {
								refreshEventRequests()
									.then((updatedRequests) => {
										setEventRequests(updatedRequests);
										const newMessageAudio =
											document.getElementById("newMessageAudio");
										newMessageAudio.play();
									})
									.catch((e) => {
										console.log(e);
									});
							} else if (e.data.includes("new message received")) {
								refreshMessageThreads()
									.then((updatedThreads) => {
										setMessageThreads(updatedThreads);
										setUnreadMessages(
											countAndAggregateUnreadMessages(
												updatedThreads,
												socket.userID
											)
										);
										const newMessageAudio =
											document.getElementById("newMessageAudio");
										newMessageAudio.play();
									})
									.catch((e) => {
										console.log(e);
									});
							}
						};
						setWebsocket(socket);
					}
					//finally resolve
					resolve();
				})
				.catch((e) => {
					reject(e);
				});
		});
	};

	const onLogin = (email, password) => {
		console.log("onLogin: email -> ", email, ", password", password);
		//if the user is logged in, immediately reject
		if (isAuthenticated || isAuthenticatedMod) {
			setError("You are already logged in.");
			return;
		}
		loginRequest(email, password)
			.then(async (u) => {
				let calendar, events;
				try {
					const eventsAndCalendar = await getEventsAndCalendar(u._id);
					calendar = eventsAndCalendar.calendar;
					events = eventsAndCalendar.events;
				} catch (e) {
					setError("Problem loading the calendar");
					calendar = {};
					events = [];
				}
				//create a websocket client
				if (!websocket) {
					const socketProtocol =
						window.location.protocol === "https:" ? "wss:" : "ws:";
					const socketUrl = socketProtocol + "//localhost:8080/connect"; //"//creativeu-app.live/connect"; //+ "//localhost:4242/connect";
					const socket = new WebSocket(socketUrl);

					socket.userID = u._id;

					socket.onopen = () => {
						socket.send(`initial_connection ${u._id}`);
					};

					socket.onmessage = (e) => {
						if (e.data === "new event request action") {
							refreshEventRequests()
								.then((updatedRequests) => {
									setEventRequests(updatedRequests);
									const newMessageAudio =
										document.getElementById("newMessageAudio");
									newMessageAudio.play();
								})
								.catch((e) => {
									console.log(e);
								});
						} else if (e.data.includes("new message received")) {
							refreshMessageThreads()
								.then((updatedThreads) => {
									setMessageThreads(updatedThreads);
									setUnreadMessages(
										countAndAggregateUnreadMessages(
											updatedThreads,
											socket.userID
										)
									);
									const newMessageAudio =
										document.getElementById("newMessageAudio");
									newMessageAudio.play();
								})
								.catch((e) => {
									console.log(e);
								});
						}
					};
					setWebsocket(socket);
				}
				setEventRequests(u.eventRequests);
				setMessageThreads(u.messageThreads);
				setUnreadMessages(
					countAndAggregateUnreadMessages(u.messageThreads, u._id)
				);
				delete u.messageThreads;
				delete u.eventRequests;
				setUser({ ...u, calendar, events });
				setIsAuthenticated(true);
			})
			.catch((e) => {
				if (e.message.includes("403")) {
					setError(
						"Your account has been suspended due to violation of the Terms of Service. Your subscription is canceled and you will not be billed further."
					);
				} else if (e.message.includes("404")) {
					setError("Email not registered");
				} else {
					setError("Incorrect username or password.");
				}
			});
	};

	const onLogout = () => {
		console.log("onLogout ->");
		setIsAuthenticated(false);
		logoutRequest()
			.then(() => {
				setIsAuthenticated(false);
				setUser(null);
				setMessageThreads([]);
				setUnreadMessages(0);
				setError(null);
				//also need to delete the EventSource connection
			})
			.catch((e) => {
				setError(e.message);
			});
	};

	const onUpdate = (fieldValuePairs) => {
		console.log("onUpdate: filedValuePairs -> ", fieldValuePairs);
		return new Promise((resolve, reject) => {
			updateRequest(fieldValuePairs)
				.then((u) => {
					setUser({ ...user, ...u });
					resolve();
				})
				.catch((e) => {
					reject(e);
				});
		});
	};

	const onDelete = () => {
		console.log("onDelete -> ");
		return new Promise((resolve, reject) => {
			deleteRequest()
				.then(() => {
					setIsAuthenticated(false);
					setUser(null);
					setError(null);
					resolve();
				})
				.catch((e) => {
					reject("There was a problem deleting the account");
				});
		});
	};

	const onEventReqAction = (recipientID) => {
		console.log("onEventReqAction: recipientID -> ", recipientID);
		return new Promise((resolve, reject) => {
			if (websocket) {
				websocket.send(`event_request_action ${recipientID}`);
			}
			if (user) {
				refreshEventRequests()
					.then((updatedRequests) => {
						setEventRequests(updatedRequests);
						resolve();
					})
					.catch((e) => {
						reject();
					});
			}
		});
	};

	const onNewMessage = (recipientID) => {
		console.log("onNewMessage: recipientID -> ", recipientID);
		return new Promise((resolve, reject) => {
			if (websocket) {
				websocket.send(`new_message ${recipientID}`);
				resolve();
			} else reject();
		});
	};

	const onToggleBlockedStatus = (otherPartyID) => {
		console.log("onToggleBlockedStatus: otherPartyID -> ", otherPartyID);
		return new Promise(async (resolve, reject) => {
			try {
				const updatedUser = await toggleBlockedStatus(otherPartyID);
				setUser(updatedUser);
				resolve();
			} catch (e) {
				reject();
			}
		});
	};

	const onReportUser = (otherParty, reason) => {
		console.log("onReportUser: otherParty -> ", otherParty, ", reason", reason);
		return new Promise(async (resolve, reject) => {
			try {
				const updatedUser = await reportUser(otherParty, reason);
				setUser(updatedUser);
				resolve();
			} catch (e) {
				reject();
			}
		});
	};

	//Moderator fields
	const onLoginMod = (email, password) => {
		console.log("onLoginMod: email -> ", email, ", password", password);
		if (isAuthenticated || isAuthenticatedMod) {
			setError("You are already logged in.");
			return;
		}
		loginRequestMod(email, password)
			.then(async (u) => {
				setMod(u);
				setIsAuthenticatedMod(true);
			})
			.catch((e) => {
				setError(e.message);
			});
	};

	const onLogoutMod = () => {
		console.log("onLogoutMod ->");
		logoutRequestMod()
			.then(() => {
				setIsAuthenticatedMod(false);
				setMod(null);
				setError(null);
				//also need to delete the EventSource connection
			})
			.catch((e) => {
				setError(e.message);
			});
	};

	return (
		<AuthenticationContext.Provider
			value={{
				user,
				setUser,
				userType,
				userLocation,
				error,
				changeUserType,
				onRegister,
				onLogin,
				onLogout,
				onUpdate,
				onDelete,
				setUser,
				onEventReqAction,
				onNewMessage,
				eventRequests,
				messageThreads,
				unreadMessages,
				setMessageThreads,
				setUnreadMessages,
				setEventRequests,
				isAuthenticated,
				isAuthenticatedMod,
				setIsAuthenticated,
				mod,
				onLoginMod,
				onLogoutMod,
				countAndAggregateUnreadMessages,
				onToggleBlockedStatus,
				onReportUser,
			}}
		>
			<audio src={newMessageSound} id="newMessageAudio" />
			{children}
		</AuthenticationContext.Provider>
	);
};
