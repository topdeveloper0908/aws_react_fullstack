import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { AuthenticationContext } from "../../../services/authentication/authentication.context";
import { FilesContext } from "../../../services/files/files.context";
import styles from "./profile.module.css";
import { ContentBox } from "../components/content-box/ContentBox.component";
import { Events } from "../components/events-display/Events.component";
import { OwnWeekView } from "../components/calendar/own-week-view/OwnWeekView.component";
import { SubscriptionsScreen } from "../../subscriptions/Subscriptions.screen";
import { Thumbnail } from "../components/thumbnail/Thumbnail.component";
import { AudioPlayer } from "../components/audio-player/AudioPlayer.component";
import { checkUris } from "../../../services/webrisk-api/webrisk-api.service";
import { Toast } from "../../../components/toast/Toast.component";
import { v4 as uuidv4 } from "uuid";

export const Profile = () => {
	const { user, onUpdate, isLoading, isAuthenticated } = useContext(
		AuthenticationContext
	);
	const { onUpload, onUploadMedia, onDeleteMedia } = useContext(FilesContext);
	const [forcedRerenders, setForcedRerenders] = useState(0);
	const [aboutContent, setAboutContent] = useState(user.about);
	const [aboutEditEnabled, setAboutEditEnabled] = useState(false);
	const [aboutContentSaving, setAboutContentSaving] = useState(0); // 0 - not saving, 1 saving, 2 saved, 3 error
	const [links, setLinks] = useState(user.links);
	const [linksEditEnabled, setLinksEditEnabled] = useState(false);
	const [linkToAdd, setLinkToAdd] = useState("");
	const [linksSaving, setLinksSaving] = useState(0);
	const [linkError, setLinkError] = useState("");
	const [visualMediaFile, setVisualMediaFile] = useState(null);
	const [audioMediaFile, setAudioMediaFile] = useState(null);
	const [visualMediaEditEnabled, setVisualMediaEditEnabled] = useState(false);
	const [audioMediaEditEnabled, setAudioMediaEditEnabled] = useState(false);
	const [visualMediaSaving, setVisualMediaSaving] = useState(0);
	const [audioMediaSaving, setAudioMediaSaving] = useState(0);
	const [visualMediaTitle, setVisualMediaTitle] = useState("");
	const [audioMediaTitle, setAudioMediaTitle] = useState("");
	const [products, setProducts] = useState([]);
	const [showCoverPhotoToast, setShowCoverPhotoToast] = useState(false);
	const [showProfilePicToast, setShowProfilePicToast] = useState(false);
	const [showVisualMediaToast, setShowVisualMediaToast] = useState(false);
	const [showAudioMediaToast, setShowAudioMediaToast] = useState(false);

	let upcomingEvents = [];

	if (user.events && user.events.length > 0) {
		upcomingEvents = user.events
			.filter((evt) => {
				return new Date(evt.startTime) >= Date.now();
			})
			.slice(0, 5);
	}

	return user.accountActive ? (
		<div className={styles.profileContainer}>
			<div
				style={{
					backgroundImage: user.coverPhotoUrl
						? `url(${user.coverPhotoUrl})`
						: "none",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
				className={styles.coverContainer}
			>
				<div className={styles.coverPhoto}>
					<input
						type="file"
						id="coverPhotoInput"
						accept="image/png, image/jpeg, image/webp"
						style={{ visibility: "hidden" }}
						onChange={(event) => {
							onUpload(
								`${user._id}/cover_photos/${event.target.files[0].name}`,
								event.target.files[0],
								"coverPhotoUrl"
							)
								.then(setForcedRerenders(forcedRerenders + 1))
								.catch((e) => {
									if (!showCoverPhotoToast) {
										setShowCoverPhotoToast(e.response.status === 400 ? 1 : 2);
										setTimeout(() => {
											setShowAudioMediaToast(false);
										}, 7000);
									}
								});
						}}
					/>
					<button
						className={`btn ${styles.changeCoverPhoto}`}
						onClick={(event) => {
							const coverPhotoInput =
								document.getElementById("coverPhotoInput");
							coverPhotoInput.click();
						}}
					>
						Edit Cover Photo
					</button>
				</div>
				<input
					type="file"
					id="profilePicInput"
					accept="image/png, image/jpeg, image/webp" //add .txt to test for viruses
					style={{ visibility: "hidden" }}
					onChange={(event) => {
						onUpload(
							`${user._id}/profile_pic/${event.target.files[0].name}`,
							event.target.files[0],
							"profilePicUrl"
						)
							.then(setForcedRerenders(forcedRerenders + 1))
							.catch((e) => {
								if (!showProfilePicToast) {
									setShowProfilePicToast(e.response.status === 400 ? 1 : 2);
									setTimeout(() => {
										setShowProfilePicToast(false);
									}, 7000);
								}
							});
					}}
				/>

				<div className={styles?.headingContainer}>
					<div className={styles?.headingTextContainer}>
						<h1 className={styles?.heading}>{user?.displayName}</h1>
						<h2 className={styles?.subheading}>
							{user?.category}
							{user?.tags?.map((t, i) => {
								return (
									<span className={styles?.tag} key={t}>
										{i !== 0 ? "| " : ""}
										{t}
									</span>
								);
							})}
						</h2>
						<h3 className={styles.subheadingSmall}>
							{user.city},{" "}
							{user.stateOrProvince ? user.stateOrProvince + ", " : ""}{" "}
							{user.country}
						</h3>
					</div>
				</div>
				<div
					style={{
						backgroundImage: user.profilePicUrl
							? `url(${user.profilePicUrl})`
							: "none",
					}}
					className={styles.profilePic}
				>
					<button
						className="btn"
						style={{
							position: "absolute",
							bottom: "-23px",
							right: "52.5px",
						}}
						onClick={(event) => {
							const profilePicInput =
								document.getElementById("profilePicInput");
							profilePicInput.click();
						}}
					>
						Edit Profile Pic
					</button>
				</div>
			</div>
			<div className={styles.contentContainer}>
				<div className={styles.contentInnerContainer}>
					<h2 className={styles.contentHeading}>
						About
						<button
							className={`btn ${styles.editContent}`}
							onClick={(event) => {
								setAboutEditEnabled(true);
								const aboutInput = document.getElementById("about");
								aboutInput.focus();
							}}
						>
							Edit
						</button>
					</h2>
					<textarea
						id="about"
						className={styles.textContent}
						readOnly={!aboutEditEnabled}
						value={aboutContent}
						onChange={(event) => {
							setAboutContent(event.target.value);
						}}
					/>
					<div className={styles.contentBtnRow}>
						<button
							className="btn-cancel"
							style={{
								visibility: aboutEditEnabled ? "visible" : "hidden",
							}}
							onClick={(event) => {
								setAboutContentSaving(0);
								setAboutContent(user.about);
								setAboutEditEnabled(false);
							}}
							disabled={isLoading}
						>
							Cancel
						</button>
						<button
							className="btn-save"
							style={{
								visibility: aboutEditEnabled ? "visible" : "hidden",
							}}
							onClick={(event) => {
								if (aboutContent.length) {
									setAboutContentSaving(1);
									onUpdate([{ field: "about", value: aboutContent }])
										.then((_) => {
											setAboutContentSaving(2);
										})
										.catch((_) => {
											setAboutContentSaving(3);
										});
								}
							}}
							disabled={isLoading}
						>
							Save
						</button>
						{aboutContentSaving === 1 && (
							<ScaleLoader
								color={"#FFFFFF"}
								loading={true}
								size={20}
								speedMultiplier={0.5}
							/>
						)}
						<span className={styles.saveMessage}>
							{aboutContentSaving === 2
								? "Saved"
								: aboutContentSaving === 3
								? "Save Failed"
								: ""}
						</span>
					</div>
				</div>
			</div>
			{/* <div className={styles.aboutContainer}>
        <div className={styles.aboutInnerContainer}>
          <h2 className={styles.aboutHeading}>
            My Shop
            <Link
              to="/myshop"
              style={{
                fontSize: "16px",
                marginLeft: "8px",
                marginRight: "8px",
              }}
            >
              <FontAwesomeIcon icon={faPen} size="1x" color="white" />
            </Link>
          </h2>
          <div className={styles.productsWrapper}>
            {products.map((product) => {
              return <ProductThumbnail product={product} />;
            })}
          </div>
        </div>
      </div> */}
			<div className={styles.contentContainer}>
				<div className={styles.contentInnerContainer}>
					<h2 className={styles.contentHeading}>
						Links
						<button
							className={`btn ${styles.editContent}`}
							onClick={(event) => {
								setLinksEditEnabled(true);
							}}
						>
							Edit
						</button>
					</h2>
					<p className={styles.text} style={{ marginLeft: "18px" }}>
						NOTE: Links must begin with http:// or https://
					</p>
					<div className={styles.links}>
						{linksEditEnabled ? (
							<>
								<div className="formRow">
									<div className={styles.labelInputButtonGroupInput}>
										<label htmlFor="addLink" className={styles.text}>
											Add a Link
										</label>
										<br />
										<input
											type="text"
											value={linkToAdd}
											onChange={(event) => {
												setLinkError("");
												setLinkToAdd(event.target.value);
											}}
											className="textInput"
										/>
									</div>
									<div className={styles.labelInputButtonGroupButton}>
										<button
											onClick={(event) => {
												event.preventDefault();
												//ensure link includes http / https
												if (
													!linkToAdd.includes("//") ||
													(linkToAdd.split("//")[0] !== "http:" &&
														linkToAdd.split("//")[0] !== "https:")
												) {
													setLinkError(
														"Link must begin with http:// or https://"
													);
													return;
												}
												if (
													linkToAdd.length > 0 &&
													!links.includes(linkToAdd) &&
													linkToAdd.match(
														/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
													) &&
													links.length < 6
												) {
													setLinks([...links, linkToAdd.trim()]);
													setLinkToAdd("");
												} else {
													setLinkError("Please enter a valid link.");
												}
											}}
										>
											+
										</button>
									</div>
								</div>
								<p className="errorMessage">{linkError}</p>
								<div className={styles.editLinksOuterContainer}>
									<ul className={styles.editLinksInnerContainer}>
										{links &&
											links?.map((link) => {
												return (
													<li key={link} className={styles.editableLink}>
														{link.length <= 30
															? link
															: link.substring(0, 11) + "..."}
														<button
															onClick={(event) => {
																event.preventDefault();
																const filteredLinks = links.filter((l) => {
																	return l !== link;
																});
																setLinks(filteredLinks);
															}}
														>
															<span>
																<FontAwesomeIcon icon={faTimes} size="1x" />
															</span>
														</button>
													</li>
												);
											})}
									</ul>
								</div>
								<div className={styles.contentBtnRow}>
									<button
										className="btn-cancel"
										onClick={(event) => {
											setLinksSaving(0);
											setLinks(user.links);
											setLinksEditEnabled(false);
										}}
										disabled={isLoading}
									>
										Cancel
									</button>
									<button
										className="btn-save"
										onClick={(event) => {
											setLinksSaving(1);
											//check that the uris are safe
											checkUris(links)
												.then(() => {
													onUpdate([{ field: "links", value: links }])
														.then((_) => {
															setLinksSaving(2);
														})
														.catch((_) => {
															setLinksSaving(3);
														});
												})
												.catch((e) => {
													if (e.threats) {
														setLinkError(
															`Safety issues were detected in the following links: ${e.threats.join(
																" "
															)}. Please remove these links and try again.`
														);
														setLinksSaving(3);
													} else {
														setLinkError(
															"Could not verify link safety. Please try again later."
														);
														setLinksSaving(3);
													}
												});
										}}
										disabled={isLoading}
									>
										Save
									</button>
									{linksSaving === 1 && (
										<ScaleLoader
											color={"#FFFFFF"}
											loading={true}
											size={20}
											speedMultiplier={0.5}
										/>
									)}
									<span className={styles.saveMessage}>
										{linksSaving === 2
											? "Saved"
											: linksSaving === 3
											? "Save Failed"
											: ""}
									</span>
								</div>
							</>
						) : (
							<div className={styles.readonlyLinksContainer}>
								{links?.map((link) => {
									return (
										<a
											href={link}
											target="_blank"
											rel="noreferrer"
											className={styles.link}
										>
											{link}
										</a>
									);
								})}
							</div>
						)}
					</div>
				</div>
			</div>
			<div className={styles.contentContainer}>
				<div className={styles.contentInnerContainer}>
					<h2 className={styles.contentHeading}>
						Visual Media
						<button
							className={`btn ${styles.editContent}`}
							onClick={(event) => {
								setVisualMediaEditEnabled(true);
							}}
						>
							Edit
						</button>
					</h2>
					{visualMediaEditEnabled ? (
						<div style={{ marginLeft: "20px" }}>
							<label className={styles.text} htmlFor="visualMediaInput">
								Select an Image
							</label>
							<br />
							<input
								style={{ color: "white" }}
								type="file"
								id="visualMediaInput"
								accept="image/*"
								onChange={(event) => {
									setVisualMediaFile(event.target.files[0]);
								}}
							/>
							<br />
							<label htmlFor="vmTitle" className={styles.text}>
								Image Title
							</label>
							<br />
							<input
								type="text"
								id="vmTitle"
								name="vmTitle"
								className="textInput"
								style={{
									width: "200px",
								}}
								value={visualMediaTitle}
								onChange={(e) => {
									setVisualMediaTitle(e.target.value);
								}}
							/>
							<div style={{ width: "100%", height: "18px" }}></div>
							<div className={styles.contentBtnRow}>
								<button
									className="btn-cancel"
									onClick={(event) => {
										setVisualMediaSaving(0);
										setVisualMediaFile(null);
										setVisualMediaTitle("");
										const vmInput = document.getElementById("visualMediaInput");
										vmInput.files = null;
										setVisualMediaEditEnabled(false);
									}}
									disabled={isLoading}
								>
									Cancel
								</button>
								<button
									className="btn-save"
									onClick={() => {
										if (
											visualMediaFile &&
											visualMediaTitle.length > 0 &&
											user.visualMedia.length < 20
										) {
											setVisualMediaSaving(1);
											onUploadMedia(
												`${user._id}/visualmedia/${visualMediaFile.name}`,
												visualMediaFile,
												"visual",
												visualMediaTitle,
												visualMediaFile.type
											)
												.then(() => {
													setVisualMediaSaving(2);
													setVisualMediaFile(null);
													const vmInput =
														document.getElementById("visualMediaInput");
													vmInput.files = null;
													setForcedRerenders(forcedRerenders + 1);
												})
												.catch((e) => {
													setVisualMediaSaving(3);
													if (!showVisualMediaToast) {
														setShowVisualMediaToast(
															e.response.status === 400 ? 1 : 2
														);
														setTimeout(() => {
															setShowVisualMediaToast(false);
														}, 7000);
													}
												});
										}
									}}
									disabled={isLoading}
								>
									Upload
								</button>
								{visualMediaSaving === 1 && (
									<ScaleLoader
										color={"#FFFFFF"}
										loading={true}
										size={20}
										speedMultiplier={0.5}
									/>
								)}
								<span className={styles.saveMessage}>
									{visualMediaSaving === 2
										? "Saved"
										: visualMediaSaving === 3
										? "Save Failed"
										: ""}
								</span>
							</div>
						</div>
					) : null}
					<div className={styles.thumbnailsContainer}>
						{user.visualMedia?.map((obj, indexx) => {
							return (
								<Thumbnail
									key={indexx}
									url={obj.url}
									title={obj.title}
									editable={visualMediaEditEnabled}
									deleteImg={onDeleteMedia}
								/>
							);
						})}
					</div>
				</div>
			</div>
			<div className={styles.contentContainer}>
				<div className={styles.contentInnerContainer}>
					<h2 className={styles.contentHeading}>
						Audio Media
						<button
							className={`btn ${styles.editContent}`}
							onClick={(event) => {
								setAudioMediaEditEnabled(true);
							}}
						>
							Edit
						</button>
					</h2>
					{audioMediaEditEnabled ? (
						<div style={{ marginLeft: "20px" }}>
							<label className={styles.text} htmlFor="audioMediaInput">
								Select an Audio File (.mp3 or .wav)
							</label>
							<br />
							<input
								style={{ color: "white" }}
								type="file"
								id="audioMediaInput"
								accept="audio/mp3, audio/wav"
								onChange={(event) => {
									setAudioMediaFile(event.target.files[0]);
								}}
							/>
							<br />
							<label htmlFor="amTitle" className={styles.text}>
								Track Title
							</label>
							<br />
							<input
								type="text"
								id="amTitle"
								name="amTitle"
								className="textInput"
								style={{ width: "200px" }}
								value={audioMediaTitle}
								onChange={(e) => {
									setAudioMediaTitle(e.target.value);
								}}
							/>
							<div style={{ width: "100%", height: "18px" }}></div>
							<div className={styles.contentBtnRow}>
								<button
									className="btn-cancel"
									onClick={(event) => {
										setAudioMediaSaving(0);
										setAudioMediaFile(null);
										setAudioMediaTitle("");
										const amInput = document.getElementById("audioMediaInput");
										amInput.files = null;
										setAudioMediaEditEnabled(false);
									}}
									disabled={isLoading}
								>
									Cancel
								</button>
								<button
									className="btn-save"
									onClick={() => {
										if (audioMediaFile && audioMediaTitle.length > 0) {
											setAudioMediaSaving(1);
											onUploadMedia(
												`${user._id}/audiomedia/${audioMediaFile.name}`,
												audioMediaFile,
												"audio",
												audioMediaTitle,
												audioMediaFile.type
											)
												.then(() => {
													setAudioMediaSaving(2);
													setAudioMediaFile(null);
													setAudioMediaTitle("");
													const amInput =
														document.getElementById("audioMediaInput");
													amInput.files = null;
													setForcedRerenders(forcedRerenders + 1);
												})
												.catch((e) => {
													setAudioMediaSaving(3);
													if (!showAudioMediaToast) {
														setShowAudioMediaToast(
															e.response.status === 400 ? 1 : 2
														);
														setTimeout(() => {
															setShowAudioMediaToast(false);
														}, 7000);
													}
												});
										}
									}}
									disabled={isLoading}
								>
									Upload
								</button>
								{audioMediaSaving === 1 && (
									<ScaleLoader
										color={"#FFFFFF"}
										loading={true}
										size={20}
										speedMultiplier={0.5}
									/>
								)}
								<span className={styles.saveMessage}>
									{audioMediaSaving === 2
										? "Saved"
										: audioMediaSaving === 3
										? "Save Failed"
										: ""}
								</span>
							</div>
						</div>
					) : null}
					<div
						className={styles.editLinksOuterContainer}
						style={{ margin: "20px" }}
					>
						<ul className={styles.editLinksInnerContainer}>
							{user.audioMedia &&
								user.audioMedia?.map((obj) => {
									return (
										<li key={obj.title} className={styles.editableLink}>
											{obj.title.length <= 30
												? obj.title
												: obj.title.substring(0, 11) + "..."}
											<button
												style={{
													display: audioMediaEditEnabled ? "flex" : "none",
												}}
												onClick={() => {
													onDeleteMedia(obj.url, "audio");
												}}
											>
												<span>
													<FontAwesomeIcon icon={faTimes} size="1x" />
												</span>
											</button>
										</li>
									);
								})}
						</ul>
					</div>
				</div>
			</div>
			<ContentBox titlePosition="left" titleText="Upcoming Events">
				{upcomingEvents.length > 0 ? (
					<Events events={upcomingEvents} />
				) : (
					<p className={styles.noDataMessage}>
						You do not have any upcoming events.
					</p>
				)}
			</ContentBox>
			<ContentBox titlePosition="right" titleText="Calendar">
				<OwnWeekView
					// key={""}
					startDate={(() => {
						const today = new Date(Date.now());
						const year = today.getFullYear();
						let month = String(today.getMonth() + 1);
						let date = String(today.getDate());
						if (month.length < 2) month = "0".concat(month);
						if (date.length < 2) date = "0".concat(date);
						return `${year}-${month}-${date}`;
					})()}
				/>
			</ContentBox>
			<AudioPlayer audioArray={user.audioMedia} />
			<div style={{ width: "100%", height: "110px" }}></div>
			<div className={styles.toastContainer}>
				{showCoverPhotoToast && <Toast code={showCoverPhotoToast} />}
				{showProfilePicToast && <Toast code={showProfilePicToast} />}
				{showVisualMediaToast && <Toast code={showVisualMediaToast} />}
				{showAudioMediaToast && <Toast code={showAudioMediaToast} />}
			</div>
		</div>
	) : (
		<div>
			<SubscriptionsScreen />
		</div>
	);
};
