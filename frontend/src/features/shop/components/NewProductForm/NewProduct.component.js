import React, { useState, useContext, useEffect } from "react";
import Autocomplete from "react-autocomplete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { AuthenticationContext } from "../../../../services/authentication/authentication.context";
import { createProductRequest } from "../../../../services/products/product.service";
import styles from "./new-product.module.css";

export const NewProductForm = ({
  closeModal,
  refreshParent,
  setParentError,
}) => {
  const { user } = useContext(AuthenticationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    tags: user.tags,
    quantityInStock: "",
    isDigital: false,
    parcelLength: "",
    parcelWidth: "",
    parcelHeight: "",
    parcelWeight: "",
    files: [],
    images: [],
  });
  const [newTag, setNewTag] = useState("");

  //style the autocomplete element
  useEffect(() => {
    const inputEls = document.querySelectorAll('[role="combobox"]');
    inputEls.forEach((el, index) => {
      el.classList.add("textInput");
      const parent = el.parentElement;
      parent.classList.add("autocompleteContainer");
      if (index === 0) {
        el.setAttribute("id", "category");
      }
    });
  }, []);

  return (
    <form className={styles.newProductForm}>
      <div className={styles.formInnerContainer}>
        <div className={styles.closeBtnContainer}>
          <button onClick={closeModal} className={styles.closeBtn}>
            <FontAwesomeIcon icon={faTimes} color="white" size="2x" />
          </button>
        </div>
        <h3>Create a New Product</h3>
        <label htmlFor="name">Product Name</label>
        <input
          className="textInput"
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
          }}
        />
        <br />
        <label htmlFor="price">Price (USD)</label>
        <span className={styles.inputUnitWrapper}>
          $
          <input
            className="textInput"
            type="number"
            id="price"
            name="price"
            min={0}
            value={formData.price}
            onKeyDown={(e) => {
              //if the key isn't backspace, delete, tab, the arrow keys, or a number, don't change the value
              console.log(e.key);
              if (
                e.key !== "Backspace" &&
                e.key !== "Delete" &&
                e.key !== "Tab" &&
                e.key !== "." &&
                e.key !== "ArrowLeft" &&
                e.key !== "ArrowRight" &&
                e.key !== "ArrowUp" &&
                e.key !== "ArrowDown" &&
                !e.key.match(/\d/)
              ) {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              let price = e.target.value;
              if (price.includes(".")) {
                price = price.split(".");
                if (price[1].length > 2) {
                  price[1] = price[1].substring(0, 2);
                }
                price = price.join(".");
              }
              setFormData({ ...formData, price });
            }}
          />
        </span>
        <br />
        <label htmlFor="category">Category</label>
        <Autocomplete
          getItemValue={(item) => item.label}
          items={[
            { label: "Art" },
            { label: "Books" },
            { label: "Clothing/Accessories" },
            { label: "Collectibles/Memorabilia" },
            { label: "Crafts" },
            { label: "DVDs/Movies" },
            { label: "Jewelry" },
            { label: "Music" },
            { label: "Musical Instruments" },
            { label: "Pottery/Glass" },
            { label: "Other" },
          ]}
          renderItem={(item, isHighlighted) => (
            <div
              style={{
                background: isHighlighted ? "white" : "#121212",
                color: isHighlighted ? "#121212" : "white",
              }}
            >
              {item.label}
            </div>
          )}
          value={formData.category}
          onChange={(event) => {
            setFormData({ ...formData, category: event.target.value });
          }}
          onSelect={(val) => {
            setFormData({ ...formData, category: val });
          }}
        />
        <br />
        <label htmlFor="description">
          Please enter a short description of the product.
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
          }}
          className={styles.textarea}
        />
        <br />
        <div className={styles.tagsOuterContainer}>
          <label htmlFor="add-a-tag">Add a Tag</label>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <input
              className="textInput"
              type="text"
              id="add-a-tag"
              name="add-a-tag"
              value={newTag}
              onChange={(e) => {
                setNewTag(e.target.value);
              }}
            />
            <button
              className={styles.saveBtn}
              onClick={(e) => {
                e.preventDefault();
                if (!formData.tags.includes(newTag)) {
                  setFormData({
                    ...formData,
                    tags: [...formData.tags, newTag],
                  });
                  setNewTag("");
                }
              }}
            >
              Add Tag
            </button>
          </div>
          <ul className={styles.tagsInnerContainer}>
            {formData.tags &&
              formData.tags.map((tag) => {
                return (
                  <li key={tag} className={styles.tag}>
                    {tag.length <= 12 ? tag : tag.substring(0, 11) + "..."}
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
                  </li>
                );
              })}
          </ul>
        </div>
        <br />
        <label htmlFor="isDigital">
          Is this a physical or a digital product?
        </label>
        <select
          className="textInput"
          onChange={(e) => {
            const isDigital = e.target.value === "digital";
            console.log(isDigital);
            setFormData({ ...formData, isDigital });
          }}
        >
          <option value="physical">Physical</option>
          <option value="digital">Digital</option>
        </select>
        <br />
        {formData.isDigital ? (
          <>
            <label htmlFor="files">Add Files for Digital Products</label>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {formData.files.map((file, index) => {
                if (file) {
                  return (
                    <div className={styles.file}>
                      {file.name}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setFormData({
                            ...formData,
                            files: formData.files.filter((_, i) => {
                              return i !== index;
                            }),
                          });
                        }}
                      >
                        <span>X</span>
                      </button>
                    </div>
                  );
                } else return null;
              })}
            </div>
            <br />
            <input
              id="files-0"
              type="file"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  files: [...e.target.files],
                });
                e.target.files = null;
                e.target.value = null;
              }}
            />
            <input
              id="files-1"
              type="file"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  files: [...formData.files, ...e.target.files],
                });
                e.target.files = null;
                e.target.value = null;
              }}
            />
            <input
              id="files-2"
              type="file"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  files: [...formData.files, ...e.target.files],
                });
                e.target.files = null;
                e.target.value = null;
              }}
            />
            <input
              id="files-3"
              type="file"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  files: [...formData.files, ...e.target.files],
                });
                e.target.files = null;
                e.target.value = null;
              }}
            />
            <input
              id="files-4"
              type="file"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  files: [...formData.files, ...e.target.files],
                });
                e.target.files = null;
                e.target.value = null;
              }}
            />
            <button
              className="btn"
              onClick={(event) => {
                event.preventDefault();
                const nextItemToAdd = formData.files.length;
                if (nextItemToAdd > 4) return;
                const inputEl = document.getElementById(
                  `files-${nextItemToAdd}`
                );
                inputEl.click();
              }}
            >
              <FontAwesomeIcon icon={faPlusCircle} size="1x" color="white" />
              <div style={{ minWidth: "8px", display: "inline-block" }}></div>
              Add a file
            </button>
          </>
        ) : (
          <>
            <label htmlFor="quantityInStock">Quantity In Stock</label>
            <input
              className="textInput"
              type="number"
              id="quantityInStock"
              name="quantityInStock"
              value={formData.quantityInStock}
              disabled={formData.isDigital}
              min={1}
              onKeyDown={(e) => {
                //if the key isn't backspace, delete, tab, the arrow keys, or a number, don't change the value
                if (
                  e.key !== "Backspace" &&
                  e.key !== "Delete" &&
                  e.key !== "Tab" &&
                  e.key !== "ArrowLeft" &&
                  e.key !== "ArrowRight" &&
                  e.key !== "ArrowUp" &&
                  e.key !== "ArrowDown" &&
                  !e.key.match(/\d/)
                ) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  quantityInStock: Number(e.target.value),
                });
              }}
            />
            <br />
            <label>Parcel Dimensions*</label>
            <div className={styles.formRow}>
              <div className={styles.labelInputGroup}>
                <label htmlFor="parcelLength">Length</label>
                <br />
                <span className={styles.inputUnitWrapper}>
                  <input
                    min={0}
                    max={108}
                    className="textInput"
                    type="number"
                    id="parcelLength"
                    name="parcelLength"
                    value={formData.parcelLength}
                    onKeyDown={(e) => {
                      //if the key isn't backspace, delete, tab, the arrow keys, or a number, don't change the value
                      if (
                        e.key !== "Backspace" &&
                        e.key !== "Delete" &&
                        e.key !== "Tab" &&
                        e.key !== "ArrowLeft" &&
                        e.key !== "ArrowRight" &&
                        e.key !== "ArrowUp" &&
                        e.key !== "ArrowDown" &&
                        e.key !== "." &&
                        !e.key.match(/\d/)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        parcelLength: e.target.value,
                      });
                    }}
                  />
                  in.
                </span>
              </div>
              <div className={styles.labelInputGroup}>
                <label htmlFor="parcelWidth">Width</label>
                <br />
                <span className={styles.inputUnitWrapper}>
                  <input
                    className="textInput"
                    min={0}
                    max={108}
                    type="number"
                    id="parcelWidth"
                    name="parcelWidth"
                    value={formData.parcelWidth}
                    onKeyDown={(e) => {
                      //if the key isn't backspace, delete, tab, the arrow keys, or a number, don't change the value
                      if (
                        e.key !== "Backspace" &&
                        e.key !== "Delete" &&
                        e.key !== "Tab" &&
                        e.key !== "ArrowLeft" &&
                        e.key !== "ArrowRight" &&
                        e.key !== "ArrowUp" &&
                        e.key !== "ArrowDown" &&
                        e.key !== "." &&
                        !e.key.match(/\d/)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      setFormData({ ...formData, parcelWidth: e.target.value });
                    }}
                  />
                  in.
                </span>
              </div>
              <div className={styles.labelInputGroup}>
                <label htmlFor="parcelHeight">Height</label>
                <br />
                <span className={styles.inputUnitWrapper}>
                  <input
                    min={0}
                    max={108}
                    className="textInput"
                    type="number"
                    id="parcelHeight"
                    name="parcelHeight"
                    value={formData.parcelHeight}
                    onKeyDown={(e) => {
                      //if the key isn't backspace, delete, tab, the arrow keys, or a number, don't change the value
                      if (
                        e.key !== "Backspace" &&
                        e.key !== "Delete" &&
                        e.key !== "Tab" &&
                        e.key !== "ArrowLeft" &&
                        e.key !== "ArrowRight" &&
                        e.key !== "ArrowUp" &&
                        e.key !== "ArrowDown" &&
                        e.key !== "." &&
                        !e.key.match(/\d/)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        parcelHeight: e.target.value,
                      });
                    }}
                  />
                  in.
                </span>
              </div>
              <div className={styles.labelInputGroup}>
                <label htmlFor="parcelWeight">Weight</label>
                <br />
                <span className={styles.inputUnitWrapper}>
                  <input
                    min={0}
                    max={150}
                    className="textInput"
                    type="number"
                    id="parcelWeight"
                    name="parcelWeight"
                    value={formData.parcelWeight}
                    onKeyDown={(e) => {
                      //if the key isn't backspace, delete, tab, the arrow keys, or a number, don't change the value
                      if (
                        e.key !== "Backspace" &&
                        e.key !== "Delete" &&
                        e.key !== "Tab" &&
                        e.key !== "ArrowLeft" &&
                        e.key !== "ArrowRight" &&
                        e.key !== "ArrowUp" &&
                        e.key !== "ArrowDown" &&
                        e.key !== "." &&
                        !e.key.match(/\d/)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        parcelWeight: e.target.value,
                      });
                    }}
                  />{" "}
                  lbs.
                </span>
              </div>
            </div>
            <h3
              style={{
                margin: 0,
                marginTop: "16px",
                marginBottom: "4px",
                padding: 0,
              }}
            >
              ⚠️ IMPORTANT
            </h3>
            <p style={{ margin: 0, padding: 0 }}>
              Please ensure that you accurately measure the dimensions of the
              package you intend to ship your product in, including the weight
              of the <strong>fully packaged product</strong>, to ensure the
              accuracy of the shipping label we generate. It may be advisable to
              round decimal units up. Most carriers will ship parcels with a
              maximum weight of 150 lbs, a maximum length of 108 in. and a
              maximum total length and width of 165 in. CreativeU is not
              responsible for providing a new shipping label in the event that
              the provided shipping label is inaccurate, or for any other
              reason.
            </p>
          </>
        )}
        <br />
        <label htmlFor="images">Add Images of Your Product</label>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {formData.images.map((image, index) => {
            console.log(image);
            if (image) {
              return (
                <div className={styles.file}>
                  {image.name}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setFormData({
                        ...formData,
                        images: formData.images.filter((_, i) => {
                          return i !== index;
                        }),
                      });
                    }}
                  >
                    <span>X</span>
                  </button>
                </div>
              );
            } else return null;
          })}
        </div>
        <br />
        <input
          id="images-0"
          type="file"
          onChange={(e) => {
            setFormData({
              ...formData,
              images: [...e.target.files],
            });
            e.target.files = null;
            e.target.value = null;
          }}
        />
        <input
          id="images-1"
          type="file"
          onChange={(e) => {
            setFormData({
              ...formData,
              images: [...formData.images, ...e.target.files],
            });
            e.target.files = null;
            e.target.value = null;
          }}
        />
        <input
          id="images-2"
          type="file"
          onChange={(e) => {
            setFormData({
              ...formData,
              images: [...formData.images, ...e.target.files],
            });
            e.target.files = null;
            e.target.value = null;
          }}
        />
        <input
          id="images-3"
          type="file"
          onChange={(e) => {
            setFormData({
              ...formData,
              images: [...formData.images, ...e.target.files],
            });
            e.target.files = null;
            e.target.value = null;
          }}
        />
        <input
          id="images-4"
          type="file"
          onChange={(e) => {
            setFormData({
              ...formData,
              images: [...formData.images, ...e.target.files],
            });
            e.target.files = null;
            e.target.value = null;
          }}
        />
        <button
          className="btn"
          onClick={(event) => {
            event.preventDefault();
            const nextItemToAdd = formData.images.length;
            if (nextItemToAdd > 4) return;
            const inputEl = document.getElementById(`images-${nextItemToAdd}`);
            inputEl.click();
          }}
        >
          <FontAwesomeIcon icon={faPlusCircle} size="1x" color="white" />
          <div style={{ minWidth: "8px", display: "inline-block" }}></div>Add an
          image
        </button>
        <br />
        <button
          className="btn"
          onClick={(e) => {
            e.preventDefault();
            //validate required fields --> validate fields with least specific error messaging last
            let checksPassed = true;
            if (!formData.isDigital) {
              if (!(Number(formData.quantityInStock) > 0)) {
                const input = document.getElementById("quantityInStock");
                input.classList.add(`${styles.required}`);
                checksPassed = false;
                setError(
                  "Please ensure that you enter a quantity greater than 0."
                );
              }
              if (!(Number(formData.length) > 0)) {
                const input = document.getElementById("quantityInStock");
                input.classList.add(`${styles.required}`);
                checksPassed = false;
                setError("Dimensions are required for physical products.");
              }
            }
            if (!formData.tags.length > 0) {
              const input = document.getElementById("add-a-tag");
              input.classList.add(`${styles.required}`);
              checksPassed = false;
              setError("Please add at least one tag.");
            }
            if (!formData.name.length > 0) {
              const input = document.getElementById("name");
              input.classList.add(`${styles.required}`);
              checksPassed = false;
              setError("Please complete all of the required fields.");
            }
            if (!Number(formData.price) > 0) {
              const input = document.getElementById("price");
              input.classList.add(`${styles.required}`);
              checksPassed = false;
              setError("Please complete all of the required fields.");
            }
            if (!formData.category.length > 0) {
              const inputEls = document.querySelectorAll('[role="combobox"]');
              inputEls.forEach((inputEl) => {
                inputEl.classList.add(`${styles.required}`);
                setError("Please complete all of the required fields.");
              });
              checksPassed = false;
            }
            if (!formData.description.length > 0) {
              const input = document.getElementById("description");
              input.classList.add(`${styles.required}`);
              checksPassed = false;
              setError("Please complete all of the required fields.");
            }
            const imageNames = formData.images.map((image) => {
              return `${user._id}/${formData.name}/images/${image.name}`;
            });
            if (checksPassed) {
              let reqObj;
              if (formData.isDigital) {
                const fileNames = formData.files.map((file) => {
                  return `${user._id}/${formData.name}/downloadable_files/${file.name}`;
                });
                reqObj = {
                  name: formData.name,
                  price: formData.price,
                  isDigital: formData.isDigital,
                  category: formData.category,
                  description: formData.description,
                  tags: formData.tags,
                  files: formData.files,
                  images: formData.images,
                  fileNames,
                  imageNames,
                };
              } else {
                reqObj = {
                  name: formData.name,
                  price: formData.price,
                  isDigital: formData.isDigital,
                  category: formData.category,
                  description: formData.description,
                  tags: formData.tags,
                  quantityInStock: formData.quantityInStock,
                  images: formData.images,
                  imageNames,
                  parcelLength: formData.parcelLength,
                  parcelWidth: formData.parcelWidth,
                  parcelHeight: formData.parcelHeight,
                  parcelWeight: formData.parcelWeight,
                };
              }
              createProductRequest(reqObj)
                .then(refreshParent)
                .catch(setParentError);
            }
          }}
        >
          Create Product
        </button>
      </div>
    </form>
  );
};
