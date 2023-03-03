import React, { useState, useEffect } from "react";
import { ProductThumbnail } from "../../components/ProductThumbnail/ProductThumbnail.component";
import { getAllProducts } from "../../../../services/products/product.service";
import { NewProductForm } from "../../components/NewProductForm/NewProduct.component";

export const ShopScreen = () => {
  //link to my shop
  //search bar
  //filter options
  //add to cart option on product thumbnail
  //best-selling
  //top-rated
  //new from followed creatives
  //recommended for me
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    getAllProducts()
      .then((res) => {
        const { bestSelling, topRated, newest } = res.data;
        setBestSellingProducts(bestSelling);
        setTopRatedProducts(topRated);
        setNewestProducts(newest);
      })
      .catch((e) => {
        console.log(e);
        setError(e);
      });
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#121212",
        width: "100vw",
        paddingTop: "100px",
      }}
    >
      <h3 style={{ color: "white", textAlign: "center" }}>Shop</h3>
      <h3 style={{ color: "white", textAlign: "left" }}>New Products</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
        }}
      >
        {newestProducts.map((product) => {
          return <ProductThumbnail product={product} />;
        })}
      </div>
      <h3 style={{ color: "white", textAlign: "left" }}>Best-selling</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
        }}
      >
        {bestSellingProducts.map((product) => {
          return <ProductThumbnail product={product} />;
        })}
      </div>
      <h3 style={{ color: "white", textAlign: "left" }}>Highest Rated</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
        }}
      >
        {topRatedProducts.map((product) => {
          return <ProductThumbnail product={product} />;
        })}
      </div>
    </div>
  );
};
