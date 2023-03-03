//

import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";


import { AuthenticationContext } from "../../../services/authentication/authentication.context";
import ScaleLoader from "react-spinners/ScaleLoader";
import axios from "axios";
import styles from "./onboarding-modal.module.css";
const basicURL = process.env.REACT_APP_BACKEND_URL;

export const OnboardingModalScreen = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [pageToShow, setPageToShow] = useState(true);
	const [link, setLink] = useState(null);
	const [error, setError] = useState(null);
	const { user, onUpdate } = useContext(AuthenticationContext);

	/*useEffect will check the user object to see if their account is verified. if not, it will make a call to
  the backend to get the user's account verification link. if so, it will check whether the user has previously viewed the
  message displaying their joinCode. if they have, nothing will be displayed. if they have not, this message will display and a call
  will be made to update the user to indicate that they have viewed the message.
  */

	useEffect(() => {
		//if the user is not an account executive, don't show this modal.
		if (!user.isAccountExec) {
			setIsLoading(false);
			setPageToShow(null);
		}
		//if the user is an account executive
		else if (user.isAccountExec && !user.accountVerified) {
			//if the user hasn't verified their connected account, do so now
			axios
				.get(`${basicURL}/connected_account_link`)
				.then((res) => {
					setLink(res.data);
					setIsLoading(false);
				})
				.catch((e) => {
					setError(e.message);
					setIsLoading(false);
				});
		} else if (
			user.isAccountExec &&
			user.accountVerified &&
			!user.hasViewedOnboardingMessage
		) {
			setIsLoading(false);
		} else {
			//otherwise, if the user's account is verified and they've already seen the onboarding message, don't show anything
			setIsLoading(false);
			setPageToShow(null);
		}
	}, []);

	return pageToShow ? (
		<div
			className={styles.modalContainer}
			style={isLoading ? { backgroundColor: "#121212" } : {}}
		>
			{isLoading ? (
				<div>
					<div style={{ marginLeft: "34px" }}>
						<ScaleLoader
							color={"#FFFFFF"}
							loading={true}
							speedMultiplier={0.5}
						/>
					</div>
					<h2 className={styles.text} style={{ textAlign: "center" }}>
						Loading...
					</h2>
				</div>
			) : (
				<div className={styles.modal}>
					<div className={styles.closeBtnContainer}>
						<button
							onClick={() => {
								setPageToShow(null);
								//if the user is an account executive with a verified account, or the user is not an account exec,
								//set their hasViewedOnboardingMessage to true
								if (user.accountVerified) {
									onUpdate([
										{ field: "hasViewedOnboardingMessage", value: true },
									])
										.then(() => {
											return;
										})
										.catch((e) => {
											setError(e.message);
										});
								}
							}}
							className={styles.closeBtn}
						>
							<FontAwesomeIcon icon={faTimes} color="white" size="2x" />
						</button>
					</div>
					<h2 className={styles.text}>
						Welcome to your new CreativeU account, {user.fname}!
					</h2>
					<h3 className={styles.text}>
						Complete the following steps to get started:
					</h3>
					<ol style={{ marginTop: "0", paddingTop: "0" }}>
						<li className={styles.text}>
							<h3
								style={
									user.accountVerified ? { textDecoration: "line-through" } : {}
								}
							>
								Verify Your Stripe Connected Account
							</h3>
							{!user.accountVerified ? (
								<>
									<p>
										CreativeU partners with{" "}
										<strong style={{ color: "#635bff" }}>Stripe</strong> to
										handle financial transactions securely. Once your Connected
										Account is verified, you'll earn percentages of the
										subscription fees for users that you refer through your
										unique link.
									</p>
									<a href={link} className={styles.link}>
										Verify Your Account
									</a>
									<p>
										<span style={{ color: "yellow" }}>⚠️ Important:</span> Once
										you have followed the steps on the Stripe Website, it may
										take some time for your CreativeU account to fully update.
									</p>
								</>
							) : (
								<>
									<p>Your account has been verified!</p>
									<p>
										Your referral link is{" "}
										<a
											className={styles.link}
											href={`https://creativeu.live/register?referrer=${user.joinCode}`}
										>
											https://creativeu.live/register?referrer={user.joinCode}
										</a>
									</p>
									<p>
										You can also view your link from your account settings page.
									</p>
								</>
							)}
						</li>
						<li className={styles.text}>
							<h3>Set up your profile page.</h3>
							<p>
								From your profile page, you can add a profile picture, a cover
								photo, a bio, external links, media, and events.
							</p>
							<Link to="/profile" className={styles.link} onClick={() => {
								setPageToShow(false)
							}}>
								Go to my profile
							</Link>
						</li>
						<li className={styles.text}>
							<h3>Check out your account settings page.</h3>
							<p>
								From your account settings page, you can customize your profile
								url and more.
							</p>
						</li>
					</ol>
					<button
						className="btn"
						onClick={() => {
							setPageToShow(null);
							//if the user is an account executive with a verified account, or the user is not an account exec,
							//set their hasViewedOnboardingMessage to true
							if (
								(user.isAccountExec && user.accountVerified) ||
								!user.isAccountExec
							) {
								onUpdate([{ field: "hasViewedOnboardingMessage", value: true }])
									.then(() => {
										return;
									})
									.catch((e) => {
										setError(e.message);
									});
							}
						}}
					>
						Ok!
					</button>
				</div>
			)}
		</div>
	) : null;
};
