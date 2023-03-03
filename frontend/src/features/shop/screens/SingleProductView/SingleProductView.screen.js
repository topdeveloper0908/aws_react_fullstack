import React, { useContext, useEffect, useState } from "react";
import { SearchContext } from "../../../../services/search/search.context";
import { OrdersContext } from "../../../../services/orders/orders.context";
import { ImageCarousel } from "../../components/ImageCarousel/ImageCarousel.component";
import { Link, useHistory } from "react-router-dom";
import styles from "./single-product-view.module.css";
import { ContentBox } from "../../../../components/content-box/ContentBox.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStarHalf } from "@fortawesome/free-solid-svg-icons";
import { getProduct } from "../../../../services/products/product.service";

export const SingleProductView = () => {
  const history = useHistory();
  const { productResults } = useContext(SearchContext);
  const { updateShoppingCart } = useContext(OrdersContext);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const p = params.get("product");
    console.log(p);
    //now look up the product
    //try to find it in the search results first
    if (productResults.length > 0) {
      const r = productResults.find((res) => {
        return res._id === p;
      });
      //if found, set it to the product
      if (r) {
        setProduct(r);
      } else {
        //otherwise, look it up in the database
        getProduct(p)
          .then((res) => {
            setProduct(res.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    } else {
      getProduct(p)
        .then((res) => {
          setProduct(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  return (
    <div className={styles.productScreenContainer}>
      {product ? (
        <>
          <div className={styles.horizontalContainer}>
            <ImageCarousel
              imgUrls={product.photoUrls}
              productName={product.name}
            />
            <div className={styles.infoContainer}>
              <h1 className={styles.heading}>{product.name}</h1>
              <p className={styles.text}>
                Seller:{" "}
                <Link to="/" className={styles.link}>
                  {product.sellerName}
                </Link>
              </p>
              <strong>Category</strong>
              <p>{product.category}</p>
              <strong>Tags</strong>
              <p>
                {(() => {
                  const text = product.tags.join(" | ");
                  return text;
                })()}
              </p>
              <i>{product.isDigital && "This is a digital product"}</i>
              <h3>${product.price}</h3>
              <button
                onClick={() => {
                  updateShoppingCart(product, 1);
                  history.push("/shoppingcart");
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
          <div className={styles.additionalInfoContainer}>
            <ContentBox titleText="Description" titlePosition="left">
              {product.description}
            </ContentBox>
            <ContentBox titleText="Other Info" titlePosition="right">
              <div className={styles.horizontalContainer}>
                <div>
                  <h3>Average Rating</h3>
                  <div>
                    {(() => {
                      let returnArr = [];
                      let i = 1;
                      for (i; i <= product.averageRating; i++) {
                        returnArr.push(
                          <FontAwesomeIcon icon={faStar} color="#ffd700" />
                        );
                      }
                      console.log(i);
                      if (product.averageRating - (i - 1) === 0.5) {
                        returnArr.push(
                          <FontAwesomeIcon icon={faStarHalf} color="#ffd700" />
                        );
                      }
                      return returnArr;
                    })()}
                  </div>
                </div>
                <div>
                  <h3>Units Sold</h3>
                  <h3>{product.unitsSold}</h3>
                </div>
                <div>
                  <h3>Units in Stock</h3>
                  <h3>{product.quantityInStock}</h3>
                </div>
              </div>
            </ContentBox>
            <ContentBox titlePosition="left" titleText="Reviews">
              {}
            </ContentBox>
          </div>
        </>
      ) : (
        <h3>No product selected</h3>
      )}
    </div>
  );
};
