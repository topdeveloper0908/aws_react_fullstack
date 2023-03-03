import React, { useState, useEffect } from "react";
import Autocomplete from "react-autocomplete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { emailInUse } from "../../../../../services/authentication/authentication.service";
import styles from "../register-form-creative.module.css";

export const ArtistInfoForm = ({ parentFormData, setParentPage }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    email: parentFormData.current.email,
    fname: parentFormData.current.fname,
    lname: parentFormData.current.lname,
    displayName: parentFormData.current.displayName,
    category: parentFormData.current.category,
    tags: parentFormData.current.tags,
    isDiscoverable: parentFormData.current.isDiscoverable,
  });
  const [tagToAdd, setTagToAdd] = useState(null);

  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    return new Promise(async (resolve, reject) => {
      if (email.length === 0) {
        setEmailError("Please enter an email address");
        resolve(false);
      } else {
        if (
          !email.match(
            /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
          )
        ) {
          setEmailError("Please enter a valid email address.");
          resolve(false);
        } else {
          try {
            const inUse = await emailInUse(email);
            if (inUse) {
              setEmailError("Email address is already linked to an account.");
              resolve(false);
            } else {
              setEmailError("");
              resolve(true);
            }
          } catch (e) {
            setEmailError("There was a problem verifying the email address.");
            resolve(false);
          }
        }
      }
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.subheading}>Your Info</h2>
      <div className="formRow">
        <div className="labelInputGroup">
          <label htmlFor="email">Email*</label>
          <br />
          <input
            className="textInput"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(event) => {
              parentFormData.current = {
                ...parentFormData.current,
                email: event.target.value,
              };
              setFormData({ ...formData, email: event.target.value });
            }}
          />
          <br />
          <small className={styles.errorMessageSmall}>{emailError}</small>
        </div>
      </div>
      <div className="formRow">
        <div className="labelInputGroup">
          <label htmlFor="fname">First Name*</label>
          <br />
          <input
            className="textInput"
            type="text"
            id="fname"
            name="fname"
            value={formData.fname}
            onChange={(event) => {
              parentFormData.current = {
                ...parentFormData.current,
                fname: event.target.value,
              };
              setFormData({ ...formData, fname: event.target.value });
            }}
          />
        </div>
        <div className="labelInputGroup">
          <label htmlFor="lname">Last Name*</label>
          <br />
          <input
            className="textInput"
            type="text"
            id="lname"
            name="lname"
            value={formData.lname}
            onChange={(event) => {
              parentFormData.current = {
                ...parentFormData.current,
                lname: event.target.value,
              };
              setFormData({ ...formData, lname: event.target.value });
            }}
          />
        </div>
      </div>
      <div className="formRow">
        <div className="labelInputGroup">
          <label htmlFor="displayName">Artist/Stage/Band/Group Name</label>
          <br />
          <input
            className="textInput"
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={(event) => {
              parentFormData.current = {
                ...parentFormData.current,
                displayName: event.target.value,
              };
              setFormData({ ...formData, displayName: event.target.value });
            }}
          />
        </div>
      </div>
      <div className="formRow">
        <div className="labelInputGroup">
          <label htmlFor="category">Category*</label>
          <br />
          <input
            type="text"
            list="categories"
            id="category"
            name="category"
            className="textInput"
            onChange={(event) => {
              parentFormData.current = {
                ...parentFormData.current,
                category: event.target.value,
              };
              setFormData({ ...formData, category: event.target.value });
            }}
          />
          <datalist id="categories">
            <option value="Actor">Actor</option>
            <option value="Acrobat">Acrobat</option>
            <option value="Author">Author</option>
            <option value="Balloon Artist">Balloon Artist</option>
            <option value="Bodyartist">Bodyartist</option>
            <option value="Circus Performer">Circus Performer</option>
            <option value="Clown">Clown</option>
            <option value="Costume Designer">Costume Designer</option>
            <option value="Comedian">Comedian</option>
            <option value="Crafter">Crafter</option>
            <option value="Dancer">Dancer</option>
            <option value="Designer">Designer</option>
            <option value="Historian">Historian</option>
            <option value="Illustrator">Illustrator</option>
            <option value="Impersonator">Impersonator</option>
            <option value="Juggler">Juggler</option>
            <option value="Magician">Magician</option>
            <option value="Mime">Mime</option>
            <option value="Musical Theatre Performer">
              Musical Theatre Performer
            </option>
            <option value="Musician">Musician</option>
            <option value="Photographer">Photographer</option>
            <option value="Poet">Poet</option>
            <option value="Public Speaker">Public Speaker</option>
            <option value="Puppeteer">Puppeteer</option>
            <option value="Radio Personality">Radio Personality</option>
            <option value="Storyteller">Storyteller</option>
            <option value="Street Performer">Street Performer</option>
            <option value="Stuntperson">Stuntperson</option>
            <option value="Television Personality">
              Television Personality
            </option>
            <option value="Typographer">Typographer</option>
            <option value="Ventriloquist">Ventriloquist</option>
            <option value="Videographer">Videographer</option>
            <option value="Visual Artist">Visual Artist</option>
            <option value="Voice Actor">Voice Actor</option>
          </datalist>
        </div>
      </div>
      {/* common tags should be saved throughout the application*/}
      <div className="formRow">
        <div className={styles.labelInputButtonGroupInput}>
          <label htmlFor="addTag">
            Add a Tag <i>(you're searchable by your tags)</i>
          </label>
          <br />
          <div className={styles.tagButton}>
            <input
              type="text"
              className="textInput"
              value={tagToAdd}
              onChange={(event) => setTagToAdd(event.target.value)}
            />
            <div className={styles.labelInputButtonGroupButton}>
              <button
                onClick={(event) => {
                  event.preventDefault();
                  if (
                    tagToAdd.length > 0 &&
                    !parentFormData.current.tags.includes(tagToAdd) &&
                    parentFormData.current.tags.length < 20
                  ) {
                    parentFormData.current = {
                      ...parentFormData.current,
                      tags: [...parentFormData.current.tags, tagToAdd],
                    };
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
        </div>
      </div>
      <div className={styles.tagsOuterContainer}>
        <p>Tags</p>
        <ul className={styles.tagsInnerContainer}>
          {formData.tags &&
            formData.tags.map((tag) => {
              return (
                <li key={tag} className={styles.tag}>
                  {tag.length <= 12 ? tag : tag.substring(0, 11) + "..."}
                  <button
                    onClick={(event) => {
                      event.preventDefault();
                      const filteredTags = parentFormData.current.tags.filter(
                        (t) => {
                          return t !== tag;
                        }
                      );
                      parentFormData.current = {
                        ...parentFormData.current,
                        tags: filteredTags,
                      };
                      setFormData({ ...formData, tags: filteredTags });
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
      <div className="formRow">
        <div className="labelInputGroup">
          <label htmlFor="isDiscoverable">
            Do you want your profile to be discoverable by talent agents,
            scouts, etc?
          </label>
          <select
            className="textInput"
            id="isDiscoverable"
            name="isDiscoverable"
            onChange={(e) => {
              parentFormData.current = {
                ...parentFormData.current,
                isDiscoverable: e.target.value,
              };
              setFormData({ ...formData, isDiscoverable: e.target.value });
            }}
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </div>
      </div>
      <p className={styles.errorMessage}>{error}</p>
      <button
        className="form-control"
        style={{width:"100px"}}
        onClick={async (event) => {
          event.preventDefault();
          let checkPassed = true;
          const validEmail = await validateEmail(formData.email);
          if (!validEmail) {
            const input = document.getElementById("email");
            input.classList.add(`${styles.required}`);
            checkPassed = false;
          }
          if (!formData.fname.length > 0) {
            const input = document.getElementById("fname");
            input.classList.add(`${styles.required}`);
            checkPassed = false;
          }
          if (!formData.lname.length > 0) {
            const input = document.getElementById("lname");
            input.classList.add(`${styles.required}`);
            checkPassed = false;
          }
          if (!formData.displayName.length > 0) {
            const input = document.getElementById("displayName");
            input.classList.add(`${styles.required}`);
            checkPassed = false;
          }
          if (!formData.category.length > 0) {
            const input = document.getElementById("category");
            input.classList.add(`${styles.required}`);
            checkPassed = false;
          }
          if (checkPassed) {
            setParentPage("address-info");
          } else {
            setError("Please complete all of the required fields.");
          }
        }}
      >
        Next
      </button>
    </div>
  );
};
