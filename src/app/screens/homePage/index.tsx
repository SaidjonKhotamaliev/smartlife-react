import React, { useEffect } from "react";
import ActiveUsers from "./ActiveUsers";
import Advertisement from "./Advertisement";
import Events from "./Events";
import NewDishes from "./NewDishes";
import PopularDishes from "./PopularDishes";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setNewDishes, setPopularDishes, setHotProducts } from "./slice";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import MemberService from "../../services/MemberService";
import "../../../css/home.css";
import { Member } from "../../../lib/types/member";

// REDUX SLICE
const actionDispatch = (dispatch: Dispatch) => ({
  setPopularDishes: (data: Product[]) => dispatch(setPopularDishes(data)),
  setNewDishes: (data: Product[]) => dispatch(setNewDishes(data)),
  setHotProducts: (data: Product[]) => dispatch(setHotProducts(data)),
});

export default function HomePage() {
  const { setPopularDishes, setNewDishes, setHotProducts } = actionDispatch(
    useDispatch()
  );

  useEffect(() => {
    // Data fetch
    const product = new ProductService();
    const member = new MemberService();
    product
      .getProducts({
        page: 1,
        limit: 4,
        order: "productOrders",
      })
      .then((data) => {
        console.log("data: ", data);
        setPopularDishes(data);
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
        setNewDishes(data);
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
      <PopularDishes />
      <NewDishes />
      <ActiveUsers />
      <Advertisement />
      <Events />
    </div>
  );
}
