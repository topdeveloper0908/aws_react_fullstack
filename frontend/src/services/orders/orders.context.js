import React, { createContext, useEffect, useState } from "react";

export const OrdersContext = createContext();

export const OrdersContextProvider = ({ children }) => {
  const [shoppingCart, setShoppingCart] = useState([]);
  const [shoppingCartError, setShoppingCartError] = useState("");
  const [shoppingCartTotal, setShoppingCartTotal] = useState(0);

  useEffect(() => {
    let cart = localStorage.getItem("creativeu_shopping_cart");
    if (cart) {
      setShoppingCart(JSON.parse(cart));
    }
  }, []);

  const sum = (cart) => {
    console.log("sum: cart ->", cart);
    let total = 0;
    cart.forEach((item) => {
      total += item.quantity * item.price;
    });
    return total;
  };

  const updateShoppingCart = (product, quantityModifier) => {
    console.log("updateShoppingCart: product -> ", product, ", quantityModifier", quantityModifier);
    //check if the product exists in the cart, and if so, where
    setShoppingCartError("");
    const productInCartIndex = shoppingCart.findIndex((p) => {
      return p._id === product._id;
    });
    let productInCart;
    let newQuantity;
    //if the product exists in the cart
    if (productInCartIndex >= 0) {
      productInCart = shoppingCart[productInCartIndex];
      newQuantity = productInCart.quantity + quantityModifier;
      console.log(productInCart);
      console.log("IN STOCK " + product.quantityInStock);
      console.log("NEW ORDER TOTAL " + newQuantity);
      //if the new quantity would be zero or less, remove it from the cart entirely
      if (newQuantity <= 0) {
        const modifiedCart = shoppingCart.filter((_, i) => {
          return i !== productInCartIndex;
        });
        localStorage.setItem(
          "creativeu_shopping_cart",
          JSON.stringify(modifiedCart)
        );
        setShoppingCart(modifiedCart);
        setShoppingCartTotal(sum(modifiedCart));
      } else if (newQuantity <= product.quantityInStock) {
        //if the new quantity is less than or equal to quantity in stock, it can be updated in the cart
        const modifiedCart = [...shoppingCart];
        modifiedCart[productInCartIndex].quantity = newQuantity;
        localStorage.setItem(
          "creativeu_shopping_cart",
          JSON.stringify(modifiedCart)
        );
        setShoppingCart(modifiedCart);
        setShoppingCartTotal(sum(modifiedCart));
      } else {
        //if the new quantity exceeds the number of products in stock, reject
        setShoppingCartError("Desired quantity exceeds current product stock.");
      }
    } else {
      //otherwise if the product does not exist in the cart
      //if the item doesn't exist in the cart, it must be added
      if (quantityModifier < 1) {
        setShoppingCartError(
          "Cannot remove item from cart as it does not exist."
        );
      }
      //check to see if there is enough of the product in stock
      if (product.quantityInStock >= quantityModifier) {
        const modifiedCart = [
          ...shoppingCart,
          { ...product, quantity: quantityModifier },
        ];
        localStorage.setItem(
          "creativeu_shopping_cart",
          JSON.stringify(modifiedCart)
        );
        setShoppingCart(modifiedCart);
        setShoppingCartTotal(sum(modifiedCart));
      } else {
        //otherwise, reject with an error message
        setShoppingCartError("Desired quantity exceeds current product stock.");
      }
    }
  };
  return (
    <OrdersContext.Provider
      value={{
        shoppingCart,
        shoppingCartError,
        updateShoppingCart,
        shoppingCartTotal,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
