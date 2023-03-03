// import React, { useContext, useState } from "react";
// import { AuthenticationContext } from "../../../services/authentication/authentication.context";
// import styles from "./user-type-options.module.css";
// import creative from "../../../assets/images/creative.jpg";
// import business from "../../../assets/images/business.jpg";
// import resource from "../../../assets/images/resource.jpg";
// import community from "../../../assets/images/community.jpg";

// export const UserTypeOptions = () => {
//   const [selectedType, setSelectedType] = useState("creative");
//   const [initialized, setInitialized] = useState(false);
//   const { changeUserType } = useContext(AuthenticationContext);

//   return (
//     <div className={styles.outerContainer}>
//       <div className={styles.desktopView}>
//         <div className={`${styles.textContainer} ${styles.fadeInSlow}`}>
//           <h2>
//             Continue as a{" "}
//             <span style={{ color: "yellow" }}>{selectedType}</span>
//           </h2>
//         </div>
//         <div className={styles.horizontalContainer}>
//           <div
//             className={styles.desktopImageContainer}
//             onClick={() => {
//               setSelectedType("creative");
//             }}
//           >
//             <div
//               style={{
//                 backgroundImage: `url(${creative})`,
//                 backgroundSize: "cover",
//                 backgroundRepeat: "no-repeat",
//                 backgroundPosition: "center",
//               }}
//               className={`${styles.desktopImage} ${styles.fadeInSlow} ${
//                 selectedType === "creative" ? styles.selected : ""
//               }`}
//             ></div>
//             <p className={`${styles.text} ${styles.fadeInSlow}`}>Creative</p>
//           </div>
//           <div
//             className={styles.desktopImageContainer}
//             onClick={() => {
//               setSelectedType("business");
//             }}
//           >
//             <div
//               style={{
//                 backgroundImage: `url(${business})`,
//                 backgroundSize: "cover",
//                 backgroundRepeat: "no-repeat",
//                 backgroundPosition: "center",
//               }}
//               className={`${styles.desktopImage} ${styles.fadeInSlow} ${
//                 selectedType === "business" ? styles.selected : ""
//               }`}
//             ></div>
//             <p className={`${styles.text} ${styles.fadeInSlow}`}>Business</p>
//           </div>
//           <div
//             className={styles.desktopImageContainer}
//             onClick={() => {
//               setSelectedType("resource");
//             }}
//           >
//             <div
//               style={{
//                 backgroundImage: `url(${resource})`,
//                 backgroundSize: "cover",
//                 backgroundRepeat: "no-repeat",
//                 backgroundPosition: "center",
//               }}
//               className={`${styles.desktopImage} ${styles.fadeInSlow} ${
//                 selectedType === "resource" ? styles.selected : ""
//               }`}
//             ></div>
//             <p className={`${styles.text} ${styles.fadeInSlow}`}>Resource</p>
//           </div>
//           <div
//             className={styles.desktopImageContainer}
//             onClick={() => {
//               setSelectedType("supporter");
//             }}
//           >
//             <div
//               style={{
//                 backgroundImage: `url(${community})`,
//                 backgroundSize: "cover",
//                 backgroundRepeat: "no-repeat",
//                 backgroundPosition: "center",
//               }}
//               className={`${styles.desktopImage} ${styles.fadeInSlow} ${
//                 selectedType === "supporter" ? styles.selected : ""
//               }`}
//             ></div>
//             <p className={`${styles.text} ${styles.fadeInSlow}`}>Supporter</p>
//           </div>
//         </div>
//       </div>
//       <div className={styles.mobileView}>
//         <div className={`${styles.textContainer} ${styles.fadeInSlow}`}>
//           <h2>
//             Continue as a{" "}
//             <select
//               className={styles.select}
//               value={selectedType}
//               onChange={(e) => {
//                 if (!initialized) setInitialized(true);
//                 setSelectedType(e.target.value);
//               }}
//             >
//               <option value="creative">Creative</option>
//               <option value="business">Business</option>
//               <option value="resource">Resource</option>
//               <option value="supporter">Supporter</option>
//             </select>
//           </h2>
//         </div>
//         {selectedType === "creative" && (
//           <div
//             style={{
//               backgroundImage: `url(${creative})`,
//               backgroundSize: "cover",
//               backgroundRepeat: "no-repeat",
//               backgroundPosition: "center",
//             }}
//             className={`${styles.image} ${
//               initialized ? styles.fadeIn : styles.fadeInSlow
//             }`}
//           ></div>
//         )}
//         {selectedType === "business" && (
//           <div
//             style={{
//               backgroundImage: `url(${business})`,
//               backgroundSize: "cover",
//               backgroundRepeat: "no-repeat",
//               backgroundPosition: "center",
//             }}
//             className={`${styles.image} ${
//               initialized ? styles.fadeIn : styles.fadeInSlow
//             }`}
//           ></div>
//         )}
//         {selectedType === "resource" && (
//           <div
//             style={{
//               backgroundImage: `url(${resource})`,
//               backgroundSize: "cover",
//               backgroundRepeat: "no-repeat",
//               backgroundPosition: "center",
//             }}
//             className={`${styles.image} ${
//               initialized ? styles.fadeIn : styles.fadeInSlow
//             }`}
//           ></div>
//         )}
//         {selectedType === "supporter" && (
//           <div
//             style={{
//               backgroundImage: `url(${community})`,
//               backgroundSize: "cover",
//               backgroundRepeat: "no-repeat",
//               backgroundPosition: "center",
//             }}
//             className={`${styles.image} ${
//               initialized ? styles.fadeIn : styles.fadeInSlow
//             }`}
//           ></div>
//         )}
//       </div>
//       {selectedType === "creative" && (
//         <div className={initialized ? styles.fadeIn : styles.fadeInSlow}>
//           <p className={styles.definition}>
//             /criˈeɪtɪv/ - a person who is creative, for example:
//           </p>
//           <p className={styles.examples}>
//             {" "}
//             actors, acrobats, animators, architects, historians, balloon
//             artists, bodyartists, street performers, circus performers, clowns,
//             costume designers, comedians, crafters, dancers, designers,
//             illustrators, impersonators, jugglers, authors, magicians, mimes,
//             musicians, musical theatre performers, photographers, poets, public
//             speakers, puppeteers, radio personalities, renaissance faire
//             performers, storytellers, stuntpersons, television personalities,
//             typographers, ventriloquists, videographers, visual artists, voice
//             actors
//           </p>
//         </div>
//       )}
//       {selectedType === "business" && (
//         <div className={styles.fadeIn}>
//           <p className={styles.definition}>
//             /ˈbiznəs/ - a commercial operation or company, for example:
//           </p>
//           <p className={styles.examples}>
//             recording studios, record labels, radio stations, tv stations,
//             producers, sound engineers, talent agents/talent agencies, band
//             managers, public relations, booking agents, venues, galleries, film
//             studios, antique shops, craft shops, attorneys, lighting & gig
//             equipment providers{" "}
//           </p>
//         </div>
//       )}
//       {selectedType === "resource" && (
//         <div className={styles.fadeIn}>
//           <p className={styles.definition}>
//             /ˈrēˌsôrs/ - a stock of assets that can be drawn on by a person or
//             organization, for example:
//           </p>
//           <p className={styles.examples}>
//             scholarships, grants, online resources & networking, job banks
//           </p>
//         </div>
//       )}
//       {selectedType === "supporter" && (
//         <div className={styles.fadeIn}>
//           <p className={styles.definition}>
//             /kəˈmyo͞onədē/ - a group of people living in the same place or having
//             a particular characteristic in common, for example:
//           </p>
//           <p className={styles.examples}>
//             fans, patrons, customers, or anyone else who wishes to support the
//             arts
//           </p>
//         </div>
//       )}
//       <button
//         onClick={() => {
//           if (selectedType) {
//             changeUserType(selectedType);
//           }
//         }}
//         className={`btn ${styles.fadeInSlow}`}
//       >
//         Let's create
//       </button>
//     </div>
//   );
// };

import React, { useContext, useState } from "react";
import { AuthenticationContext } from "../../../services/authentication/authentication.context";
import styles from "./user-type-options.module.css";
import creative from "../../../assets/images/creative.jpg";
import business from "../../../assets/images/business.jpg";
import resource from "../../../assets/images/resource.jpg";
import community from "../../../assets/images/community.jpg";
import { useHistory } from "react-router-dom";

export const UserTypeOptions = () => {
	const [selectedType, setSelectedType] = useState("creative");
	const [initialized, setInitialized] = useState(false);
	const { changeUserType } = useContext(AuthenticationContext);
	const history = useHistory();

	return (
		<div className={styles.outerContainer}>
			<div className={styles.desktopView}>
				<div className={`${styles.textContainer} ${styles.fadeInSlow}`}>
					<h2 style={{ color: "#fff", fontSize: 20, paddingTop: 80 }}>
						Continue as a{" "}
						<span style={{ color: "yellow" }}>{selectedType}</span>
					</h2>
				</div>
				<div className={styles.horizontalContainer}>
					<div
						className={styles.desktopImageContainer}
						onClick={() => {
							setSelectedType("creative");
						}}
					>
						<div
							style={{
								backgroundImage: `url(${creative})`,
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center",
							}}
							className={`${styles.desktopImage} ${styles.fadeInSlow} ${
								selectedType === "creative" ? styles.selected : ""
							}`}
						></div>
						<p className={`${styles.text} ${styles.fadeInSlow}`}>Creative</p>
					</div>
					<div
						className={styles.desktopImageContainer}
						onClick={() => {
							setSelectedType("business");
						}}
					>
						<div
							style={{
								backgroundImage: `url(${business})`,
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center",
							}}
							className={`${styles.desktopImage} ${styles.fadeInSlow} ${
								selectedType === "business" ? styles.selected : ""
							}`}
						></div>
						<p className={`${styles.text} ${styles.fadeInSlow}`}>Business</p>
					</div>
					<div
						className={styles.desktopImageContainer}
						onClick={() => {
							setSelectedType("resource");
						}}
					>
						<div
							style={{
								backgroundImage: `url(${resource})`,
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center",
							}}
							className={`${styles.desktopImage} ${styles.fadeInSlow} ${
								selectedType === "resource" ? styles.selected : ""
							}`}
						></div>
						<p className={`${styles.text} ${styles.fadeInSlow}`}>Resource</p>
					</div>
					<div
						className={styles.desktopImageContainer}
						onClick={() => {
							setSelectedType("supporter");
						}}
					>
						<div
							style={{
								backgroundImage: `url(${community})`,
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center",
							}}
							className={`${styles.desktopImage} ${styles.fadeInSlow} ${
								selectedType === "supporter" ? styles.selected : ""
							}`}
						></div>
						<p className={`${styles.text} ${styles.fadeInSlow}`}>Supporter</p>
					</div>
				</div>
			</div>
			<div className={styles.mobileView}>
				<div
					// className={`${styles.textContainer} ${styles.fadeInSlow}`}
					style={{ backgroundColor: "#fff" }}
				>
					<h2 style={{ color: "#fff" }}>
						Continue as a{" "}
						<select
							className={styles.select}
							value={selectedType}
							onChange={(e) => {
								if (!initialized) setInitialized(true);
								setSelectedType(e.target.value);
							}}
						>
							<option value="creative">Creative</option>
							<option value="business">Business</option>
							<option value="resource">Resource</option>
							<option value="supporter">Supporter</option>
						</select>
					</h2>
				</div>
				{selectedType === "creative" && (
					<div
						style={{
							backgroundImage: `url(${creative})`,
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
							backgroundPosition: "center",
						}}
						className={`${styles.image} ${
							initialized ? styles.fadeIn : styles.fadeInSlow
						}`}
					></div>
				)}
				{selectedType === "business" && (
					<div
						style={{
							backgroundImage: `url(${business})`,
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
							backgroundPosition: "center",
						}}
						className={`${styles.image} ${
							initialized ? styles.fadeIn : styles.fadeInSlow
						}`}
					></div>
				)}
				{selectedType === "resource" && (
					<div
						style={{
							backgroundImage: `url(${resource})`,
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
							backgroundPosition: "center",
						}}
						className={`${styles.image} ${
							initialized ? styles.fadeIn : styles.fadeInSlow
						}`}
					></div>
				)}
				{selectedType === "supporter" && (
					<div
						style={{
							backgroundImage: `url(${community})`,
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
							backgroundPosition: "center",
						}}
						className={`${styles.image} ${
							initialized ? styles.fadeIn : styles.fadeInSlow
						}`}
					></div>
				)}
			</div>
			{selectedType === "creative" && (
				<div className={initialized ? styles.fadeIn : styles.fadeInSlow}>
					<p className={styles.definition}>
						/criˈeɪtɪv/ - a person who is creative, for example:
					</p>
					<p className={styles.examples}>
						{" "}
						actors, acrobats, animators, architects, historians, balloon
						artists, bodyartists, street performers, circus performers, clowns,
						costume designers, comedians, crafters, dancers, designers,
						illustrators, impersonators, jugglers, authors, magicians, mimes,
						musicians, musical theatre performers, photographers, poets, public
						speakers, puppeteers, radio personalities, renaissance faire
						performers, storytellers, stuntpersons, television personalities,
						typographers, ventriloquists, videographers, visual artists, voice
						actors
					</p>
				</div>
			)}
			{selectedType === "business" && (
				<div className={styles.fadeIn}>
					<p className={styles.definition}>
						/ˈbiznəs/ - a commercial operation or company, for example:
					</p>
					<p className={styles.examples}>
						recording studios, record labels, radio stations, tv stations,
						producers, sound engineers, talent agents/talent agencies, band
						managers, public relations, booking agents, venues, galleries, film
						studios, antique shops, craft shops, attorneys, lighting & gig
						equipment providers{" "}
					</p>
				</div>
			)}
			{selectedType === "resource" && (
				<div className={styles.fadeIn}>
					<p className={styles.definition}>
						/ˈrēˌsôrs/ - a stock of assets that can be drawn on by a person or
						organization, for example:
					</p>
					<p className={styles.examples}>
						scholarships, grants, online resources & networking, job banks
					</p>
				</div>
			)}
			{selectedType === "supporter" && (
				<div className={styles.fadeIn}>
					<p className={styles.definition}>
						/kəˈmyo͞onədē/ - a group of people living in the same place or having
						a particular characteristic in common, for example:
					</p>
					<p className={styles.examples}>
						fans, patrons, customers, or anyone else who wishes to support the
						arts
					</p>
				</div>
			)}
			<button
				onClick={() => {
					if (selectedType) {
						changeUserType(selectedType);
						history.push("/");
					}
				}}
				className={`btn ${styles.fadeInSlow}`}
				style={{ backgroundColor: "#fff" }}
			>
				Let's create
			</button>
		</div>
	);
};
