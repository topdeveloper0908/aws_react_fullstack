import React, { useContext, useState } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { AuthenticationContext } from "../../services/authentication/authentication.context";
import { geocodeRequest } from "../../services/geocoder/geocoder.service";
import styles from "./account-settings.module.css";
import { profileUrlInUse } from "../../services/authentication/authentication.service";

const validatePassword = (pword, repeatedPword, setErr) => {
  const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$&()`.+,\/"-])/gm;
  if (pword !== repeatedPword) {
    setErr("Please ensure the password and repeated password match.");
    return false;
  }
  if (pword.length < 14) {
    setErr("Please ensure the password is at least 14 characters long.");
    return false;
  }
  if (pword.length > 64) {
    setErr("Please ensure the password is no longer than 64 characters.");
    return false;
  }
  if (!regex.test(pword)) {
    setErr(
      "Please ensure that the password contains at least one uppercase letter, one lowercase letter, one number and one symbol."
    );
    return false;
  }
  setErr("");
  return true;
};

export const AccountSettings = () => {
  const { user, onUpdate, onDelete } = useContext(AuthenticationContext); //will also need to grab onUpdate and onDeleteAccount
  const [editableFields, setEditableFields] = useState({
    displayName: false,
    // fname: false,
    // lname: false,
    address: false,
    category: false,
    password: false,
    profileUrl: false,
  });
  const [formData, setFormData] = useState({
    displayName: user.displayName,
    profileUrl: user.profileUrl,
    streetAddressLine1: user.streetAddressLine1,
    streetAddressLine2: user.streetAddressLine2,
    city: user.city,
    stateOrProvince: user.stateOrProvince,
    postalCode: user.postalCode,
    country: user.country,
    category: user.category,
    tags: user.tags,
    isDiscoverable: user.isDiscoverable,
    // showFullAddress: user.showFullAddress,
    // showPhoneNumber: user.showPhoneNumber,
    // showEmail: user.showEmail,
    password: "",
    repeatedPassword: "",
  });
  const [tagToAdd, setTagToAdd] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInputText, setDeleteInputText] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(0);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [saving, setSaving] = useState(0);
  const [deleteError, setDeleteError] = useState("");
  const [checkingProfileUrl, setCheckingProfileUrl] = useState(false);
  const [referralLinkCopied, setReferralLinkCopied] = useState(false);
  const [profileUrlCopied, setProfileUrlCopied] = useState(false);

  return (
    <div className={styles.screenContainer}>
      <div className={styles.accountSettingsContainer}>
        <h2>Account Settings</h2>
        <p>
          <i>
            Make sure to click "Save All Fields" at the bottom when you're done.
          </i>
        </p>
        <h3 style={{ margin: 0, padding: 0 }}>Names</h3>
        <hr style={{ width: "100%" }} />
        {user.isAccountExec && user.joinCode && (
          <>
            <label>Referral Link</label>
            <div>
              <a
                href={`https://creativeu.live/register?referrer=${user.joinCode}`}
                style={{ color: "yellow" }}
              >
                https://creativeu.live/register?referrer={user.joinCode}
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://creativeu.live/register?referrer=${user.joinCode}`
                  );
                  setReferralLinkCopied(true);
                }}
                className={styles.editBtn}
              >
                <FontAwesomeIcon icon={faCopy} size="1x" />
              </button>
              {referralLinkCopied && <i className={styles.fadeIn}>Copied</i>}
            </div>
            <br />
          </>
        )}
        <div className={styles.labelBtnRow}>
          <label htmlFor="displayName">Public Name</label>
          <button
            className={styles.editBtn}
            onClick={() => {
              setFormData({ ...formData, displayName: user.displayName });
              setEditableFields({
                ...editableFields,
                displayName: !editableFields.displayName,
              });
            }}
          >
            <FontAwesomeIcon icon={faPen} size="1x" />
          </button>
        </div>
        <input
          className={
            editableFields.displayName
              ? styles.inputEditable
              : styles.inputReadOnly
          }
          type="text"
          readOnly={!editableFields.displayName}
          value={formData.displayName}
          onChange={(e) => {
            setFormData({ ...formData, displayName: e.target.value });
          }}
        />
        <br />
        {editableFields.displayName && (
          <div className={styles.btnRow}>
            <button
              className="btn-cancel"
              onClick={() => {
                setFormData({ ...formData, displayName: user.displayName });
                setEditableFields({ ...editableFields, displayName: false });
              }}
            >
              Cancel
            </button>
            <button
              className="btn-save"
              onClick={() => {
                setEditableFields({ ...editableFields, displayName: false });
              }}
            >
              Ok
            </button>
          </div>
        )}

        <div className={styles.labelBtnRow}>
          <label htmlFor="profileUrl">Your Profile Url</label>
          <button
            className={styles.editBtn}
            disabled={checkingProfileUrl}
            onClick={() => {
              setFormData({ ...formData, profileUrl: user.profileUrl });
              setEditableFields({
                ...editableFields,
                profileUrl: !editableFields.profileUrl,
              });
            }}
          >
            <FontAwesomeIcon icon={faPen} size="1x" />
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `https://creativeu.live/user?user=${user.profileUrl}`
              );
              setProfileUrlCopied(true);
            }}
            className={styles.editBtn}
          >
            <FontAwesomeIcon icon={faCopy} size="1x" />
          </button>
          {profileUrlCopied && <i className={styles.fadeIn}>Copied</i>}
        </div>
        <p>https://creativeu.live/user?user=</p>
        <input
          value={formData.profileUrl}
          className={
            editableFields.profileUrl
              ? styles.inputEditable
              : styles.inputReadOnly
          }
          type="text"
          readOnly={!editableFields.profileUrl || checkingProfileUrl}
          onKeyDown={(e) => {
            if (
              !e.key.match(/\w/) &&
              e.key !== "_" &&
              e.key !== "-" &&
              e.key !== "Backspace" &&
              e.key !== "Delete" &&
              e.key !== "ArrowLeft" &&
              e.key !== "ArrowRight" &&
              e.key !== "ArrowUp" &&
              e.key !== "ArrowDown"
            ) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            if (e.target.value.length >= 50) return;
            setFormData({ ...formData, profileUrl: e.target.value.trim() });
          }}
        />
        <br />
        {editableFields.profileUrl && (
          <div className={styles.btnRow}>
            <button
              className="btn-cancel"
              disabled={checkingProfileUrl}
              onClick={() => {
                setFormData({ ...formData, profileUrl: user.profileUrl });
                setEditableFields({ ...editableFields, profileUrl: false });
              }}
            >
              Cancel
            </button>
            <button
              className="btn-save"
              disabled={checkingProfileUrl}
              onClick={async () => {
                if (formData.profileUrl !== user.profileUrl) {
                  setCheckingProfileUrl(true);
                  try {
                    const urlInUse = await profileUrlInUse(formData.profileUrl);
                    // if the url is in use, revert the formData
                    if (urlInUse) {
                      setFormData({ ...formData, profileUrl: user.profileUrl });
                      setCheckingProfileUrl(false);
                    } else {
                      //otherwise close the editor
                      setEditableFields({
                        ...editableFields,
                        profileUrl: false,
                      });
                      setCheckingProfileUrl(false);
                    }
                  } catch (e) {
                    setFormData({ ...formData, profileUrl: user.profileUrl });
                    setCheckingProfileUrl(false);
                  }
                } else {
                  //if the url hasn't changed, just close the editor
                  setEditableFields({ ...editableFields, profileUrl: false });
                }
              }}
            >
              Ok
            </button>
            {checkingProfileUrl && (
              <ScaleLoader
                color={"#FFFFFF"}
                loading={true}
                size={20}
                speedMultiplier={0.5}
              />
            )}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, padding: 0 }}>Address</h3>
          <button
            className={styles.editBtn}
            onClick={() => {
              setEditableFields({
                ...editableFields,
                address: !editableFields.address,
              });
            }}
          >
            <FontAwesomeIcon icon={faPen} size="1x" />
          </button>
        </div>
        <hr style={{ width: "100%" }} />
        <label htmlFor="streetAddressLine1">Street Address Line 1</label>
        <input
          className={
            editableFields.address ? styles.inputEditable : styles.inputReadOnly
          }
          type="text"
          readOnly={!editableFields.address}
          value={formData.streetAddressLine1}
          onChange={(e) => {
            setFormData({ ...formData, streetAddressLine1: e.target.value });
          }}
        />

        <label htmlFor="streetAddressLine2">Street Address Line 2</label>

        <input
          className={
            editableFields.address ? styles.inputEditable : styles.inputReadOnly
          }
          type="text"
          readOnly={!editableFields.address}
          value={formData.streetAddressLine2}
          onChange={(e) => {
            setFormData({ ...formData, streetAddressLine2: e.target.value });
          }}
        />
        <div className={styles.formRow}>
          <div className={styles.formRowFieldLg}>
            <label htmlFor="city">City</label>
            <br />
            <input
              className={
                editableFields.address
                  ? styles.inputEditable
                  : styles.inputReadOnly
              }
              type="text"
              readOnly={!editableFields.address}
              value={formData.city}
              onChange={(e) => {
                setFormData({ ...formData, city: e.target.value });
              }}
            />
          </div>
          <div className={styles.formRowFieldSm}>
            <label htmlFor="stateOrProvince">State/Province</label>

            <br />
            <input
              className={
                editableFields.address
                  ? styles.inputEditable
                  : styles.inputReadOnly
              }
              type="text"
              readOnly={!editableFields.address}
              value={formData.stateOrProvince}
              onChange={(e) => {
                setFormData({ ...formData, stateOrProvince: e.target.value });
              }}
            />
          </div>
          <div className={styles.formRowFieldSm}>
            <label htmlFor="postalCode">Postal Code</label>

            <br />
            <input
              className={
                editableFields.address
                  ? styles.inputEditable
                  : styles.inputReadOnly
              }
              type="text"
              readOnly={!editableFields.address}
              value={formData.postalCode}
              onChange={(e) => {
                setFormData({ ...formData, postalCode: e.target.value });
              }}
            />
          </div>
        </div>
        <label htmlFor="country">Country</label>
        <input
          className={
            editableFields.address ? styles.inputEditable : styles.inputReadOnly
          }
          type="text"
          readOnly={!editableFields.address}
          value={formData.country}
          onChange={(e) => {
            setFormData({ ...formData, country: e.target.value });
          }}
        />
        {editableFields.address && (
          <div className={styles.btnRow}>
            <button
              className="btn-cancel"
              onClick={() => {
                setFormData({
                  ...formData,
                  streetAddressLine1: user.streetAddressLine1,
                  streetAddressLine2: user.streetAddressLine2,
                  city: user.city,
                  stateOrProvince: user.stateOrProvince,
                  postalCode: user.postalCode,
                });
                setEditableFields({ ...editableFields, address: false });
              }}
            >
              Cancel
            </button>
            <button
              className="btn-save"
              onClick={() => {
                setIsGeocoding(1);
                geocodeRequest({
                  streetAddressLine1: formData.streetAddressLine1,
                  streetAddressLine2: formData.streetAddressLine2,
                  city: formData.city,
                  stateOrProvince: formData.stateOrProvince,
                  country: formData.country,
                  postalCode: formData.postalCode,
                })
                  .then((res) => {
                    setLat(res.lat);
                    setLng(res.lng);
                    setIsGeocoding(2);
                    setEditableFields({ ...editableFields, address: false });
                  })
                  .catch((e) => {
                    setIsGeocoding(3);
                  });
              }}
            >
              Ok
            </button>
            {isGeocoding === 1 && (
              <ScaleLoader
                color={"#FFFFFF"}
                loading={true}
                size={20}
                speedMultiplier={0.5}
              />
            )}
            {isGeocoding !== 0 && (
              <span className={styles.saveMessage}>
                {isGeocoding === 2
                  ? "Address found!"
                  : isGeocoding === 3
                  ? "Address not found"
                  : ""}
              </span>
            )}
          </div>
        )}
        <br />
        <h3 style={{ margin: 0, padding: 0 }}>
          Category, Tags, Discoverability
        </h3>
        <hr style={{ width: "100%" }} />
        <div className={styles.labelBtnRow}>
          <label htmlFor="category">Category</label>
          <button
            className={styles.editBtn}
            onClick={() => {
              setEditableFields({
                ...editableFields,
                category: !editableFields.category,
              });
            }}
          >
            <FontAwesomeIcon icon={faPen} size="1x" />
          </button>
        </div>
        <input
          className={
            editableFields.category
              ? styles.inputEditable
              : styles.inputReadOnly
          }
          type="text"
          readOnly={!editableFields.category}
          value={formData.category}
          onChange={(e) => {
            setFormData({ ...formData, category: e.target.value });
          }}
        />
        <br />
        {editableFields.category && (
          <div className={styles.btnRow}>
            <button
              className="btn-cancel"
              onClick={() => {
                setFormData({ ...formData, category: user.category });
                setEditableFields({ ...editableFields, category: false });
              }}
            >
              Cancel
            </button>
            <button
              className="btn-save"
              onClick={() => {
                setEditableFields({ ...editableFields, category: false });
              }}
            >
              Ok
            </button>
          </div>
        )}
        <div className={styles.labelBtnRow}>
          <label htmlFor="tags">Tags</label>
          <button
            className={styles.editBtn}
            onClick={() => {
              setEditableFields({
                ...editableFields,
                tags: !editableFields.tags,
              });
            }}
          >
            <FontAwesomeIcon icon={faPen} size="1x" />
          </button>
        </div>
        {editableFields.tags && (
          <>
            <label htmlFor="addTag">Add a Tag</label>
            <div className={styles.tagInputBtnContainer}>
              <input
                className={styles.inputEditable}
                type="text"
                value={tagToAdd}
                onChange={(event) => setTagToAdd(event.target.value)}
              />
              <div className={styles.addTagButton}>
                <button
                  onClick={(event) => {
                    event.preventDefault();
                    if (
                      tagToAdd.length > 0 &&
                      !formData.tags.includes(tagToAdd)
                    ) {
                      setFormData({
                        ...formData,
                        tags: [...formData.tags, tagToAdd.toLowerCase()],
                      });
                      setTagToAdd("");
                    }
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </>
        )}
        <div className={styles.tagsOuterContainer}>
          <ul className={styles.tagsInnerContainer}>
            {formData.tags &&
              formData.tags.map((tag) => {
                return (
                  <li key={tag} className={styles.tag}>
                    {tag.length <= 12 ? tag : tag.substring(0, 11) + "..."}
                    {editableFields.tags && (
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          const filteredTags = formData.tags.filter((t) => {
                            return t !== tag;
                          });
                          setFormData({ ...formData, tags: filteredTags });
                        }}
                      >
                        <span>
                          <FontAwesomeIcon icon={faTimes} size="1x" />
                        </span>
                      </button>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
        {editableFields.tags && (
          <div className={styles.btnRow}>
            <button
              className="btn-cancel"
              onClick={() => {
                setFormData({ ...formData, tags: user.tags });
                setEditableFields({ ...editableFields, tags: false });
              }}
            >
              Cancel
            </button>
            <button
              className="btn-save"
              onClick={() => {
                setEditableFields({ ...editableFields, tags: false });
              }}
            >
              Ok
            </button>
          </div>
        )}
        <br />
        <div className={styles.labelBtnRow}>
          <label htmlFor="isDiscoverable">
            {" "}
            Do you want your profile to be discoverable by talent agents,
            scouts, etc?
          </label>
          <button
            className={styles.editBtn}
            onClick={() => {
              setEditableFields({
                ...editableFields,
                isDiscoverable: !editableFields.isDiscoverable,
              });
            }}
          >
            <FontAwesomeIcon icon={faPen} size="1x" />
          </button>
        </div>
        <select
          className="textInput"
          id="isDiscoverable"
          name="isDiscoverable"
          onChange={(e) => {
            setFormData({ ...formData, isDiscoverable: e.target.value });
          }}
        >
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
        <br />
        <h3 style={{ margin: 0, padding: 0 }}>Password</h3>
        <hr style={{ width: "100%" }} />
        <br />
        {editableFields.password && (
          <>
            <label>New Password</label>
            <input
              type="password"
              className={styles.inputEditable}
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
            />
            <label>Confirm New Password</label>
            <input
              type="password"
              className={styles.inputEditable}
              value={formData.repeatedPassword}
              onChange={(e) => {
                setFormData({ ...formData, repeatedPassword: e.target.value });
              }}
            />
            <p>{passwordError}</p>
            <div className={styles.btnRow}>
              <button
                className="btn-cancel"
                onClick={() => {
                  setPasswordUpdated(false);
                  setFormData({
                    ...formData,
                    password: "",
                    repeatedPassword: "",
                  });
                  setEditableFields({ ...editableFields, password: false });
                }}
              >
                Cancel
              </button>
              <button
                className="btn-save"
                onClick={() => {
                  if (
                    validatePassword(
                      formData.password,
                      formData.repeatedPassword,
                      setPasswordError
                    )
                  ) {
                    setPasswordUpdated(true);
                    setEditableFields({ ...editableFields, password: false });
                  } else {
                    return;
                  }
                }}
              >
                Ok
              </button>
            </div>
          </>
        )}
        {passwordUpdated && <p>New Password Entered</p>}
        {!editableFields.password && (
          <button
            className="btn"
            onClick={() => {
              setEditableFields({ ...editableFields, password: true });
            }}
          >
            Change Password
          </button>
        )}
        <div className={styles.btnRow}>
          <button
            className={"btn-save"}
            onClick={() => {
              const fields = Object.keys(formData).filter((field) => {
                return field !== "password" && field !== "repeatedPassword";
              });
              let fieldValuePairs = fields.map((field) => {
                return {
                  field: field,
                  value: formData[field],
                };
              });
              if (passwordUpdated) {
                fieldValuePairs.push({
                  field: "password",
                  value: formData.password,
                });
              }
              if (lat && lng) {
                fieldValuePairs.push({
                  field: "lat",
                  value: lat,
                });
                fieldValuePairs.push({
                  field: "lng",
                  value: lng,
                });
              }
              setSaving(1);
              onUpdate(fieldValuePairs)
                .then(() => {
                  setSaving(2);
                })
                .catch((e) => {
                  setSaving(3);
                });
            }}
          >
            Save All Fields
          </button>
          {saving === 1 && (
            <ScaleLoader
              color={"#FFFFFF"}
              loading={true}
              size={20}
              speedMultiplier={0.5}
            />
          )}
          {saving !== 0 && (
            <span className={styles.saveMessage}>
              {saving === 2 ? "Saved" : saving === 3 ? "Save Failed" : ""}
            </span>
          )}
        </div>
        <br />
        <h3 style={{ margin: 0, padding: 0 }}>Account</h3>
        <hr style={{ width: "100%" }} />
        <br />
        <button
          className={"btn-delete"}
          onClick={() => {
            setShowDeleteModal(true);
          }}
        >
          DELETE ACCOUNT
        </button>
      </div>
      {showDeleteModal && (
        <div className={styles.deleteAccountModalContainer}>
          <div className={styles.deleteAccountModal}>
            <h3>
              <i>Deleting Your Account</i>
            </h3>
            <h3>Warning!</h3>
            <p>⚠️ ONCE DELETED, YOU CANNOT RECOVER YOUR ACCOUNT.</p>
            {/* <p>
              ⚠️ ANY ORDERS NOT MARKED AS SHIPPED WILL BE IMMEDIATELY CANCELED
              AND REFUNDED. SHIPPING AN ORDER AFTER DELETING YOUR ACCOUNT WILL
              NOT REVERSE THIS.
            </p> */}
            <p>
              Your subscription will be canceled and no further charges will be
              billed to your account.
            </p>
            <p>
              If you still wish to proceed, type <i>delete {user.email}</i>{" "}
              below
            </p>
            <input
              type="text"
              className={styles.inputEditable}
              style={{ fontStyle: "italic" }}
              placeholder={`delete ${user.email}`}
              value={deleteInputText}
              onChange={(e) => {
                setDeleteInputText(e.target.value);
                setDeleteError("");
              }}
            />
            <div className={styles.btnRow} style={{ marginTop: "16px" }}>
              <button
                className="btn-cancel"
                onClick={() => {
                  setDeleteInputText("");
                  setDeleteError("");
                  setShowDeleteModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className={"btn-delete"}
                onClick={() => {
                  if (deleteInputText === `delete ${user.email}`) {
                    onDelete();
                  } else {
                    setDeleteError(
                      `Please ensure that the text you've entered matches "delete ${user.email}"`
                    );
                  }
                }}
              >
                DELETE MY ACCOUNT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
