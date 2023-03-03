import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { OrdersContext } from "../../../../services/orders/orders.context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./shopping-cart-screen.module.css";
import { formatAsDollars } from "../../utils";

export const ShoppingCartScreen = () => {
  const history = useHistory();

  const {
    shoppingCart,
    updateShoppingCart,
    shoppingCartError,
    shoppingCartTotal,
  } = useContext(OrdersContext);

  return (
    <div className={styles.shoppingCartScreenContainer}>
      <div className={styles.shoppingCart}>
        <h1 className={styles.heading}>Your Cart</h1>
        <p>{shoppingCartError}</p>
        {shoppingCart.length > 0 ? (
          <>
            <ul className={styles.cartList}>
              {shoppingCart.map((item, index) => {
                return (
                  <li key={`${item.name}-${index}`} className={styles.cartItem}>
                    <div className={styles.quantity}>
                      <button
                        onClick={() => {
                          //add one of the item to the shopping cart
                          updateShoppingCart(item, 1);
                        }}
                      >
                        +
                      </button>
                      {item.quantity}
                      <button
                        onClick={() => {
                          //if the quantity of the item in the cart is greater than 1, subtract 1
                          //if not, the user should use the delete button to remove it
                          console.log(shoppingCart);
                          console.log(item);
                          console.log(item.quantity);
                          if (item.quantity > 1) {
                            updateShoppingCart(item, -1);
                          }
                        }}
                      >
                        -
                      </button>
                    </div>
                    <Link to="/" className={styles.link}>
                      {item.name}
                    </Link>{" "}
                    ${item.price * item.quantity}
                    <button
                      onClick={() => {
                        //delete the item from the cart
                        updateShoppingCart(item, -item.quantity);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        size="1x"
                        color="white"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
            <hr style={{ width: "100%" }} />
            <div>
              <h3 className={styles.heading} style={{ textAlign: "right" }}>
                Total: ${formatAsDollars(shoppingCartTotal)}
              </h3>
            </div>
            <div className={styles.btnContainer}>
              <button
                onClick={() => {
                  history.push("/shop");
                }}
              >
                <FontAwesomeIcon icon={faAngleLeft} size="1x" color="white" />
                Continue Shopping
              </button>
              <button>
                Proceed to Checkout{" "}
                <FontAwesomeIcon icon={faAngleRight} size="1x" color="white" />
              </button>
            </div>
          </>
        ) : (
          <h3 className={styles.heading}>Your cart is empty</h3>
        )}
      </div>
    </div>
  );
};
