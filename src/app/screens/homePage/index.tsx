import React, { useEffect } from "react";
import HotProducts from "./HotProducts";
import Advertisement from "./Advertisement";
import Events from "./Events";
import NewDishes from "./NewDishes";
import PopularDishes from "./PopularDishes";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setNewProducts, setPopularProducts, setHotProducts } from "./slice";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import "../../../css/home.css";
import { CartItem } from "../../../lib/types/search";

// REDUX SLICE
const actionDispatch = (dispatch: Dispatch) => ({
  setPopularProducts: (data: Product[]) => dispatch(setPopularProducts(data)),
  setNewProducts: (data: Product[]) => dispatch(setNewProducts(data)),
  setHotProducts: (data: Product[]) => dispatch(setHotProducts(data)),
});

interface HomePageProps {
  onAdd: (item: CartItem) => void;
}
export default function HomePage(props: HomePageProps) {
  const { onAdd } = props;
  const { setPopularProducts, setNewProducts, setHotProducts } = actionDispatch(
    useDispatch()
  );

  useEffect(() => {
    // Data fetch
    const product = new ProductService();
    product
      .getProducts({
        page: 1,
        limit: 4,
        order: "productOrders",
      })
      .then((data) => {
        console.log("data: ", data);
        setPopularProducts(data);
      })
      .catch((err) => {
        console.log(err);
      });

    product
      .getProducts({
        page: 1,
        limit: 4,
        order: "createdAt",
      })
      .then((data) => {
        console.log("data: ", data);
        setNewProducts(data);
      })
      .catch((err) => {
        console.log(err);
      });

    product
      .getProducts({
        page: 1,
        limit: 4,
        order: "productOnSale",
      })
      .then((data) => {
        console.log("data: ", data);
        setHotProducts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={"homepage"}>
      <HotProducts onAdd={onAdd} />
      <PopularDishes onAdd={onAdd} />
      <NewDishes onAdd={onAdd} />
      <Advertisement />
      <Events />
    </div>
  );
}
