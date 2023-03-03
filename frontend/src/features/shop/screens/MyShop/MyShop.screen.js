import React, { useContext, useState, useEffect } from "react";
import styles from "./my-shop.module.css";
import { NewProductForm } from "../../components/NewProductForm/NewProduct.component";
import { ProductThumbnail } from "../../components/ProductThumbnail/ProductThumbnail.component";
import { AuthenticationContext } from "../../../../services/authentication/authentication.context";
import { getUserProducts } from "../../../../services/products/product.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

export const MyShop = () => {
  const { user } = useContext(AuthenticationContext);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    getUserProducts(user._id)
      .then((res) => {
        console.log(res.data);
        setProducts(res.data);
      })
      .catch((e) => {
        console.log(e);
        setError(e);
      });
  }, []);

  const refresh = () => {
    getUserProducts(user._id)
      .then((res) => {
        console.log(res.data);
        setProducts(res.data);
      })
      .catch((e) => {
        console.log(e);
        setError(e);
      });
  };

  return (
    <div className={styles.myShopScreen}>
      <h3 className={styles.heading}>Welcome to Your Shop, {user.fname}</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
        }}
      >
        <div>
          <div
            className={styles.newProductThumbnail}
            onClick={() => {
              setShowModal(true);
            }}
          >
            <FontAwesomeIcon icon={faPlusCircle} size="3x" color="#2e2e2e" />
          </div>
          <h4 className={styles.heading}>Create New Product</h4>
        </div>
        {products.map((product) => {
          return <ProductThumbnail product={product} />;
        })}
      </div>
      {showModal && (
        <div className={styles.modalContainer}>
          <NewProductForm
            closeModal={() => {
              setShowModal(false);
            }}
            refreshParent={refresh}
            setParentError={setError}
          />
        </div>
      )}
    </div>
  );
};
