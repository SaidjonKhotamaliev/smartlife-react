import React, { useEffect } from "react";
import { Container, Stack, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import Divider from "../../components/divider";
// import Button from "@mui/material/Button";
import { Button, CssVarsProvider } from "@mui/joy";
import Rating from "@mui/material/Rating";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper";
import { createSelector } from "@reduxjs/toolkit";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { retrieveChosenProduct, retrieveRestaurant } from "./selector";
import { setChosenProduct, setRestaurant } from "./slice";
import { Product } from "../../../lib/types/product";
import { Member } from "../../../lib/types/member";
import { useParams } from "react-router-dom";
import ProductService from "../../services/ProductService";
import MemberService from "../../services/MemberService";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";

const actionDispatch = (dispatch: Dispatch) => ({
  setChosenProduct: (data: Product) => dispatch(setChosenProduct(data)),
  setRestaurant: (data: Member) => dispatch(setRestaurant(data)),
});

const chosenProductRetriever = createSelector(
  retrieveChosenProduct,
  (chosenProduct) => ({ chosenProduct })
);
const restaurantRetriever = createSelector(
  retrieveRestaurant,
  (restaurant) => ({ restaurant })
);

interface ChosenProducteProps {
  onAdd: (item: CartItem) => void;
}

export default function ChosenProduct(props: ChosenProducteProps) {
  const { onAdd } = props;
  const { setChosenProduct, setRestaurant } = actionDispatch(useDispatch());
  const { chosenProduct } = useSelector(chosenProductRetriever);
  const { restaurant } = useSelector(restaurantRetriever);

  const { productId } = useParams<{ productId: string }>();
  console.log("productId: ", productId);

  useEffect(() => {
    const product = new ProductService();

    product
      .getProduct(productId)
      .then((data) => setChosenProduct(data))
      .catch((err) => console.log(err));

    const member = new MemberService();
    member
      .getRestaurant()
      .then((data) => setRestaurant(data))
      .catch((err) => console.log(err));
  }, []);

  if (!chosenProduct) return null;
  return (
    <div className={"chosen-product"}>
      <Box className={"title"}>Product Detail</Box>
      <Container className={"product-container"}>
        <Stack className={"chosen-product-slider"}>
          <Swiper
            loop={true}
            spaceBetween={10}
            navigation={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="swiper-area"
          >
            {chosenProduct?.productImages.map((ele: string, index: number) => {
              const imagePath = `${serverApi}/${ele}`;
              return (
                <SwiperSlide key={index}>
                  <img className="slider-image" src={imagePath} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Stack>
        <Stack className={"chosen-product-info"}>
          <Box className={"info-box"}>
            <strong className={"product-name"}>
              {chosenProduct.productName}
            </strong>
            <span className={"resto-name"}>{restaurant?.memberNick}</span>
            <span className={"resto-name"}>{restaurant?.memberPhone}</span>
            <Box className={"rating-box"}>
              <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
              <div className={"evaluation-box"}>
                <div className={"product-view"}>
                  <span>Total {chosenProduct.productOrders} ordered</span>
                </div>
              </div>
            </Box>
            <p className={"product-desc"}>
              {chosenProduct?.productDesc
                ? chosenProduct?.productDesc
                : "No description"}
            </p>
            <Divider height="1" width="100%" bg="#000000" />
            <div className={"product-price"}>
              <span>Price:</span>
              <s style={{ marginLeft: "300px" }}>
                {`${
                  chosenProduct.productOnSale > 0
                    ? chosenProduct.productPrice
                    : ""
                }`}
              </s>
              <span>
                $
                {chosenProduct.productOnSale > 0
                  ? chosenProduct.productSalePrice
                  : chosenProduct.productPrice}
              </span>
            </div>

            <div className={"button-box"}>
              <CssVarsProvider>
                <Button
                  variant="solid"
                  size="lg"
                  color="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd({
                      _id: chosenProduct._id,
                      quantity: 1,
                      price:
                        chosenProduct.productOnSale > 0
                          ? chosenProduct.productSalePrice
                          : chosenProduct.productPrice,
                      name: chosenProduct.productName,
                      image: chosenProduct.productImages[0],
                    });
                  }}
                >
                  Add To Basket
                </Button>
              </CssVarsProvider>
            </div>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
