//module
import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faTachometerAlt } from "@fortawesome/free-solid-svg-icons";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

//component
import { SearchForm } from "../../features/search/components/SearchForm.component";

//Context
import { AuthenticationContext } from "../../services/authentication/authentication.context";

//css
import styles from "./navbar.module.css";



function wasRead(request, userID) {
	return (
		(request.senderID === userID && request.readBySender) ||
		(request.recipientID === userID && request.readByRecipient)
	);
}

export const Navbar = ({ linksLeft, linksRight }) => {
	const {
		isAuthenticated,
		user,
		onLogout,
		eventRequests,
		messageThreads,
		unreadMessages,
		isAuthenticatedMod,
		onLogoutMod,
	} = useContext(AuthenticationContext);
	const [unreadEventRequests, setUnreadEventRequests] = useState(0);

	useEffect(() => {
		if (isAuthenticated && user && eventRequests) {
			setUnreadEventRequests(
				eventRequests.filter((r) => {
					return !wasRead(r, user._id);
				}).length
			);
		}
	}, [isAuthenticated, user, eventRequests]);

	//whether the hamburger menu is open
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<nav className={styles.responsiveNav}>
			<div className={styles.brand}>
				<HashLink
					className={styles.brandLink}
					onClick={() => setMenuOpen(false)}
					to={"/#hero"}
				>
					CreativeU
				</HashLink>
			</div>
			<button
				className={`${styles.hamburger} ${menuOpen && styles.hamburgerActive}`}
				onClick={() => {
					setMenuOpen(!menuOpen);
				}}
			>
				<FontAwesomeIcon icon={faBars} size="3x" color="white" />
			</button>
			<ul
				className={`${styles.navbarLinks} ${
					menuOpen ? styles.menuOpen : styles.menuClosed
				}`}
			>
				<li
					key="search"
					id="search"
					className={styles.hiddenLink}
					style={{ marginBottom: "4px" }}
				>
					<SearchForm />
				</li>
				<li key={"home"} id="home">
					<HashLink
						className={styles.navbarLink}
						onClick={() => setMenuOpen(false)}
						to={"/#hero"}
					>
						<div className={styles.navbarLinkText}>Home</div>
					</HashLink>
				</li>
				<li key={"what-we-do"} id="what-we-do-link">
					<HashLink
						className={styles.navbarLink}
						onClick={() => setMenuOpen(false)}
						to={"/#what-we-do"}
					>
						<div className={styles.navbarLinkText} style={{ color: "8000ff" }}>
							What We Do
						</div>
					</HashLink>
				</li>
				<li key={"our-users"} id="our-users-link">
					<HashLink
						className={styles.navbarLink}
						onClick={() => setMenuOpen(false)}
						to={"/#our-users"}
					>
						<div className={styles.navbarLinkText} style={{ color: "80ff00" }}>
							Our Users
						</div>
					</HashLink>
				</li>
				<li key={"plans-and-pricing"} id="plans-and-pricing-link">
					<HashLink
						className={styles.navbarLink}
						onClick={() => setMenuOpen(false)}
						to={"/#plans-and-pricing"}
					>
						<div className={styles.navbarLinkText}>Plans & Pricing</div>
					</HashLink>
				</li>
				{!isAuthenticated && ( //&& !isAuthenticatedMod
					<>
						<li key={"register"} id="register">
							<HashLink
								className={styles.navbarLink}
								onClick={() => setMenuOpen(false)}
								to={"/register"}
							>
								<div className={styles.navbarLinkText}>Register</div>
							</HashLink>
						</li>
						<li key={"login"} id="login">
							<HashLink
								className={styles.navbarLink}
								onClick={() => setMenuOpen(false)}
								to={"/login"}
							>
								<div className={styles.navbarLinkText}>Login</div>
							</HashLink>
						</li>
					</>
				)}
				{isAuthenticated && (
					<>
						<li
							key={"accountSettings"}
							id="accountSettings"
							className={styles.hiddenLink}
						>
							<Link
								to="/accountsettings"
								className={styles.navbarLink}
								onClick={() => setMenuOpen(false)}
							>
								<div className={styles.navbarLinkText}>Account</div>
							</Link>
						</li>
						<li
							key={"logout"}
							id="logout"
							className={styles.hiddenLink}
							onClick={() => {
								onLogout();
								setMenuOpen(false);
							}}
						>
							<div className={styles.navbarLink}>
								<div className={styles.navbarLinkText}>Logout</div>
							</div>
						</li>
					</>
				)}
			</ul>
			<ul className={styles.navbarRightLgScreen}>
				<li key="search" id="search">
					<SearchForm />
				</li>
				{isAuthenticated && (
					<>
						<li className={styles.userMenuContainer}>
							<div className={styles.userMenuIconWrapper}>
								<Link to={"/profile"}>
									<FontAwesomeIcon icon={faUser} size="1x" color="white" />
								</Link>
								<div className={styles.userMenuTooltip}>
									View/Edit My Profile
								</div>
							</div>
							{user.isAccountExec && (
								<div className={styles.userMenuIconWrapper}>
									<Link to={"/account-exec-dashboard"}>
										<FontAwesomeIcon
											icon={faChartLine}
											size="1x"
											color="white"
										/>
									</Link>
									<div className={styles.userMenuTooltip}>
										View Account Exec. Dashboard
									</div>
								</div>
							)}
							<Link to="/eventrequests">
								<div className={styles.userMenuIconWrapper}>
									<FontAwesomeIcon
										icon={faCalendarDay}
										size="1x"
										color="white"
									/>
									<div className={styles.userMenuTooltip}>Event Requests</div>
									<div className={styles.userMenuNotifications}>
										{unreadEventRequests > 0 && unreadEventRequests}
									</div>
								</div>
							</Link>
							<Link to="/allmessages">
								<div className={styles.userMenuIconWrapper}>
									<FontAwesomeIcon icon={faInbox} size="1x" color="white" />
									<div className={styles.userMenuTooltip}>Messages</div>
									<div className={styles.userMenuNotifications}>
										{unreadMessages.count > 0 ? unreadMessages.count : ""}
									</div>
								</div>
							</Link>
							<Link to="/accountsettings">
								<div className={styles.userMenuIconWrapper}>
									<FontAwesomeIcon icon={faCog} size="1x" color="white" />
									<div className={styles.userMenuTooltip}>Account Settings</div>
								</div>
							</Link>
							<div className={styles.userMenuIconWrapper} onClick={onLogout}>
								<FontAwesomeIcon icon={faSignOutAlt} size="1x" color="white" />
								<div className={styles.userMenuTooltip}>Logout</div>
							</div>
						</li>
						<li className={styles.welcomeMessage}>Welcome, {user.fname}</li>
					</>
				)}
				{isAuthenticatedMod && (
					<>
						<li className={styles.userMenuContainer}>
							<Link to="/moddashboard">
								<div className={styles.userMenuIconWrapper}>
									<FontAwesomeIcon
										icon={faTachometerAlt}
										size="1x"
										color="white"
									/>
									<div className={styles.userMenuTooltip}>
										Moderator Dashboard
									</div>
								</div>
							</Link>
							<div className={styles.userMenuIconWrapper} onClick={onLogoutMod}>
								<FontAwesomeIcon icon={faSignOutAlt} size="1x" color="white" />
								<div className={styles.userMenuTooltip}>Logout</div>
							</div>
						</li>
						<li className={styles.welcomeMessage}>Welcome, Moderator</li>
					</>
				)}
			</ul>
			{isAuthenticated && (
				<ul className={styles.navbarLeftSmScreen}>
					<div className={styles.smScreenIcon}>
						<Link to={"/profile"}>
							<FontAwesomeIcon icon={faUser} size="2x" color="white" />
						</Link>
					</div>
					<div className={styles.smScreenIcon}>
						<Link to={"/allmessages"}>
							<FontAwesomeIcon icon={faInbox} size="2x" color="white" />
						</Link>
						<div className={styles.userMenuNotifications}>
							{unreadMessages.count > 0 ? unreadMessages.count : ""}
						</div>
					</div>
					<div className={styles.smScreenIcon}>
						<Link to="/eventrequests">
							<FontAwesomeIcon icon={faCalendarDay} size="2x" color="white" />
							<div className={styles.userMenuNotifications}>
								{unreadEventRequests > 0 && unreadEventRequests}
							</div>
						</Link>
					</div>
				</ul>
			)}
			{isAuthenticatedMod && (
				<ul className={styles.navbarLeftSmScreen}>
					<div className={styles.smScreenIcon}>
						<Link to="/moddashboard">
							<FontAwesomeIcon icon={faTachometerAlt} size="2x" color="white" />
						</Link>
					</div>
					<div className={styles.smScreenIcon} onClick={onLogoutMod}>
						<FontAwesomeIcon icon={faSignOutAlt} size="2x" color="white" />
					</div>
				</ul>
			)}
		</nav>
	);
};
