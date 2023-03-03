import React, { useState, useContext, useEffect } from "react";
import { AuthenticationContext } from "../../services/authentication/authentication.context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { Four04Page } from "../../components/404/404page.screen";
import { LineChart } from "./components/LineChart.component";
import styles from "./account-executive-dashboard.module.css";
import { DateTime } from "luxon";
import axios from "axios";

function formatAsDollars(amount) {
	let amountInDollars = (amount / 100).toString();
	if (!amountInDollars.includes(".")) amountInDollars += ".00";
	amountInDollars = "$" + amountInDollars + " (USD)";
	return amountInDollars;
}
const basicURL = process.env.REACT_APP_BACKEND_URL;

export const AccountExecutiveDashboard = () => {
	const { user } = useContext(AuthenticationContext);
	const [referralLinkCopied, setReferralLinkCopied] = useState(false);
	const [verificationLink, setVerificationLink] = useState("");
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const thisMonth = months[DateTime.now().toObject().month - 1];

	useEffect(() => {
		if (!user.accountVerified) {
			axios
				.get(`${basicURL}/connected_account_link`)
				.then((res) => {
					setVerificationLink(res.data);
				})
				.catch((e) => {
					console.log(e);
				});
		}
	});

	//my link
	//activate creativeu profile
	//my connected stripe account

	//if the user isn't an account executive or there isn't a user, return the 404 page
	if (!user || !user.isAccountExec) return <Four04Page />;
	else {
		return (
			<div className={styles.screen}>
				<div className={styles.horizontalContainer}>
					<div className={styles.cardSmall}>
						<h2>Important Links</h2>
						{user.accountVerified ? (
							<div className={styles.cardRow}>
								<div>
									<p>Visit Stripe</p>
									<div className={styles.stripeCard}>
										<a
											href={user.stripeAccountUrl}
											target="_blank"
											rel="noreferrer"
											className={styles.link}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 640 512"
											>
												<path
													fill="white"
													d="M165 144.7l-43.3 9.2-.2 142.4c0 26.3 19.8 43.3 46.1 43.3 14.6 0 25.3-2.7 31.2-5.9v-33.8c-5.7 2.3-33.7 10.5-33.7-15.7V221h33.7v-37.8h-33.7zm89.1 51.6l-2.7-13.1H213v153.2h44.3V233.3c10.5-13.8 28.2-11.1 33.9-9.3v-40.8c-6-2.1-26.7-6-37.1 13.1zm92.3-72.3l-44.6 9.5v36.2l44.6-9.5zM44.9 228.3c0-6.9 5.8-9.6 15.1-9.7 13.5 0 30.7 4.1 44.2 11.4v-41.8c-14.7-5.8-29.4-8.1-44.1-8.1-36 0-60 18.8-60 50.2 0 49.2 67.5 41.2 67.5 62.4 0 8.2-7.1 10.9-17 10.9-14.7 0-33.7-6.1-48.6-14.2v40c16.5 7.1 33.2 10.1 48.5 10.1 36.9 0 62.3-15.8 62.3-47.8 0-52.9-67.9-43.4-67.9-63.4zM640 261.6c0-45.5-22-81.4-64.2-81.4s-67.9 35.9-67.9 81.1c0 53.5 30.3 78.2 73.5 78.2 21.2 0 37.1-4.8 49.2-11.5v-33.4c-12.1 6.1-26 9.8-43.6 9.8-17.3 0-32.5-6.1-34.5-26.9h86.9c.2-2.3.6-11.6.6-15.9zm-87.9-16.8c0-20 12.3-28.4 23.4-28.4 10.9 0 22.5 8.4 22.5 28.4zm-112.9-64.6c-17.4 0-28.6 8.2-34.8 13.9l-2.3-11H363v204.8l44.4-9.4.1-50.2c6.4 4.7 15.9 11.2 31.4 11.2 31.8 0 60.8-23.2 60.8-79.6.1-51.6-29.3-79.7-60.5-79.7zm-10.6 122.5c-10.4 0-16.6-3.8-20.9-8.4l-.3-66c4.6-5.1 11-8.8 21.2-8.8 16.2 0 27.4 18.2 27.4 41.4.1 23.9-10.9 41.8-27.4 41.8zm-126.7 33.7h44.6V183.2h-44.6z"
												/>
											</svg>
											<div className={styles.stripeCardOverlay}>
												<h3>Visit My Stripe Dashboard</h3>
											</div>
										</a>
									</div>
								</div>
								<div>
									<p>Get My Referral Link</p>
									<div
										className={styles.referralLinkCard}
										onClick={() => {
											navigator.clipboard.writeText(
												`https://creativeu.live/register?referrer=${user.joinCode}`
											);
											setReferralLinkCopied(true);
											setTimeout(() => {
												setReferralLinkCopied(false);
											}, 2000);
										}}
									>
										<FontAwesomeIcon icon={faLink} size={"6x"} />
										<div className={styles.stripeCardOverlay}>
											<h3>Copy Referral Link</h3>
										</div>
										<div
											className={
												referralLinkCopied
													? styles.copiedTextVisible
													: styles.copiedTextInvisible
											}
										>
											Copied to clipboard!
										</div>
									</div>
								</div>
							</div>
						) : (
							<div>
								<p>Please verify your account here:</p>
								{verificationLink.length === 0 ? (
									<i style={{ color: "white" }}>Loading...</i>
								) : (
									<a style={{ color: "yellow" }} href={verificationLink}>
										Verify My Stripe Account
									</a>
								)}
							</div>
						)}
					</div>
					<h2
						style={{
							color: "white",
							fontFamily: "Noto Sans Display",
							width: "100%",
							textAlign: "right",
							marginRight: 0,
							paddingRight: 0,
						}}
					>
						Welcome, to your Account Executive dashboard, {user.fname}
					</h2>
				</div>
				<div className={styles.card}>
					<h2>Lifetime stats</h2>
					<div className={styles.cardContainer}>
						<div className={styles.cardInnerContainer}>
							<h3>Total Referrals</h3>
							{user.totalReferredUsers}
						</div>
						<div className={styles.cardInnerContainer}>
							<h3>Total Lifetime Membership Referrals</h3>
							{user.totalReferredLifetimeUsers}
						</div>
						<div className={styles.cardInnerContainer}>
							<h3>Total Yearly Membership Referrals</h3>
							{user.totalReferredYearlyUsers}
						</div>
						<div className={styles.cardInnerContainer}>
							<h3>Total Monthly Membership Referrals</h3>
							{user.totalReferredMonthlyUsers}
						</div>
						<div className={styles.cardInnerContainer}>
							<h3>Total Sales</h3>
							{formatAsDollars(user.totalSales)}
						</div>
						<div className={styles.cardInnerContainer}>
							<h3>Total Commissions Earned</h3>
							{formatAsDollars(user.totalCommissions)}
						</div>
					</div>
				</div>
				<div className={styles.card}>
					<h2>This Month</h2>
					<div className={styles.cardContainer}>
						<div className={styles.cardInnerContainer}>
							<h3>Total Referrals</h3>
							{user.salesRecord[thisMonth].totalReferredUsers}
						</div>
						<div className={styles.cardInnerContainer}>
							<h3>Total Lifetime Membership Referrals</h3>
							{user.salesRecord[thisMonth].totalLifetimeUsers}
						</div>
						<div className={styles.cardInnerContainer}>
							<h3>Total Yearly Membership Referrals</h3>
							{user.salesRecord[thisMonth].totalYearlyUsers}
						</div>
						<div className={styles.cardInnerContainer}>
							<h3>Total Monthly Membership Referrals</h3>
							{user.salesRecord[thisMonth].totalMonthlyUsers}
						</div>
						<div className={styles.cardInnerContainer}>
							<h3>Total Sales</h3>
							{formatAsDollars(user.salesRecord[thisMonth].totalSales)}
						</div>
						<div className={styles.cardInnerContainer}>
							<h3>Total Commissions Earned</h3>
							{formatAsDollars(user.salesRecord[thisMonth].totalCommissions)}
						</div>
						<div className={styles.cardInnerContainer}>
							<h3>Total Sales (New)</h3>
							{formatAsDollars(user.salesRecord[thisMonth].totalNewSales)}
						</div>
						<div className={styles.cardInnerContainer}>
							<h3>Total Sales (Residual)</h3>
							{formatAsDollars(user.salesRecord[thisMonth].totalResidualSales)}
						</div>
						<div className={styles.cardInnerContainer}>
							<h3>Total Commissions (New)</h3>
							{formatAsDollars(user.salesRecord[thisMonth].totalNewCommissions)}
						</div>
						<div className={styles.cardInnerContainer}>
							<h3>Total Commissions (Residual)</h3>
							{formatAsDollars(
								user.salesRecord[thisMonth].totalResidualCommissions
							)}
						</div>
					</div>
				</div>
				<div className={styles.card}>
					<h2>This Year</h2>
					<div className={styles.cardRow}>
						<div className={styles.cardInnerContainerLarge}>
							<h3>At a Glance</h3>
							<p>
								Total Referrals:{" "}
								{user.salesRecord.totalReferredUsers
									? user.salesRecord.totalReferredUsers
									: 0}
							</p>
							<p>
								Total Lifetime Membership Referrals:{" "}
								{user.salesRecord.totalReferredLifetimeUsers
									? user.salesRecord.totalReferredLifetimeUsers
									: 0}
							</p>
							<p>
								Total Yearly Membership Referrals:{" "}
								{user.salesRecord.totalReferredYearlyUsers
									? user.salesRecord.totalReferredYearlyUsers
									: 0}
							</p>
							<p>
								Total Monthly Membership Referrals:{" "}
								{user.salesRecord.totalReferredMonthlyUsers
									? user.salesRecord.totalReferredMonthlyUsers
									: 0}
							</p>
							<p>
								Total Sales:{" "}
								{formatAsDollars(
									user.salesRecord.totalSales ? user.salesRecord.totalSales : 0
								)}
							</p>
							<p>
								Total Commissions Earned:{" "}
								{formatAsDollars(
									user.salesRecord.totalCommissions
										? user.salesRecord.totalCommissions
										: 0
								)}
							</p>
							<p>
								Total Sales (New Referrals):{" "}
								{formatAsDollars(
									user.salesRecord.totalNewSales
										? user.salesRecord.totalNewSales
										: 0
								)}
							</p>
							<p>
								Total Sales (Residual):{" "}
								{formatAsDollars(
									user.salesRecord.totalResidualSales
										? user.salesRecord.totalResidualSales
										: 0
								)}
							</p>
							<p>
								Total Commissions (New Referrals):{" "}
								{formatAsDollars(
									user.salesRecord.totalNewCommissions
										? user.salesRecord.totalCommissions
										: 0
								)}
							</p>
							<p>
								Total Commissions (Residual):{" "}
								{formatAsDollars(
									user.salesRecord.totalResidualCommissions
										? user.salesRecord.totalResidualCommissions
										: 0
								)}
							</p>
						</div>
						<LineChart />
					</div>
				</div>
			</div>
		);
	}
};
