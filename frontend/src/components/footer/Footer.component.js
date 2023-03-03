import React, { useContext } from "react";
import { AuthenticationContext } from "../../services/authentication/authentication.context";
import { HashLink } from "react-router-hash-link";
import styles from "./footer.module.css";

export const Footer = () => {
	const { isAuthenticated, onLogout } = useContext(AuthenticationContext);

	return (
		<footer className={styles.footer + " " + styles.footer_footer__1v8zI}>
			<div className={styles.upperContainer}>
				<div className={styles.column}>
					<HashLink to="/#hero" className={styles.link}>
						Home
					</HashLink>
					<HashLink to="/#what-we-do" className={styles.link}>
						What We Do
					</HashLink>
					<HashLink to="/#our-users" className={styles.link}>
						Our Users
					</HashLink>
					<HashLink to="/#plans-and-pricing" className={styles.link}>
						Plans And Pricing
					</HashLink>
				</div>
				<div className={styles.column}>
					{!isAuthenticated ? (
						<>
							<HashLink to="/register" className={styles.link}>
								Register
							</HashLink>
							<HashLink to="/login" className={styles.link}>
								Login
							</HashLink>
						</>
					) : (
						<p className={styles.link} onClick={onLogout}>
							Logout
						</p>
					)}
				</div>
				<div className={styles.column}>
					<HashLink to="/contact" className={styles.link}>
						Contact Us
					</HashLink>
					<HashLink
						to="/termsandconditions"
						className={styles.link}
					>
						Terms and Conditions
					</HashLink>
				</div>
			</div>
			<div className={styles.footerunderline} />
			<br />
			<div className={styles.lowerContainer}>
				<img
					src="https://lirp.cdn-website.com/71a9c1d9/dms3rep/multi/opt/Powered-By-Webify+%281%29-237w.png"
					alt="webify logo"
					id="1489980283"
					className=""
					data-dm-image-path="https://irp.cdn-website.com/71a9c1d9/dms3rep/multi/Powered-By-Webify+%281%29.png"
					height="57.75"
					width="198.0"
				/>
			</div>
		</footer>
	);
};
