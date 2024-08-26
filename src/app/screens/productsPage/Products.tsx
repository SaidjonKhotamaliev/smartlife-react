import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  // Button,
  Container,
  Stack,
  // Typography,
  TextField,
  Badge,
  PaginationItem,
  Pagination,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  AddBox,
  ArrowBack,
  ArrowForward,
  MonetizationOn,
  RemoveRedEye,
} from "@mui/icons-material";
import { retrieveProducts } from "./selector";
import { createSelector } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { serverApi } from "../../../lib/config";
import { setProducts } from "./slice";
import { Dispatch } from "@reduxjs/toolkit";
import { Product, ProductInquiry } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { useHistory, useLocation } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import Advertisement from "../homePage/Advertisement";
import { Card, CardContent, CardOverflow, CssVarsProvider } from "@mui/joy";
import { AspectRatio, Button, Chip, Link } from "@mui/joy";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import Typography from "@mui/joy/Typography";
import SearchIcon from "@mui/icons-material/Search";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import TabletIcon from "@mui/icons-material/Tablet";
import LaptopIcon from "@mui/icons-material/Laptop";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import WatchIcon from "@mui/icons-material/Watch";

const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});

const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

interface ProductsProps {
  onAdd: (item: CartItem) => void;
}

export default function Products(props: ProductsProps) {
  const { onAdd } = props;
  const { setProducts } = actionDispatch(useDispatch());

  const { products } = useSelector(productsRetriever);
  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 8,
    order: "createdAt",
    productCollection: ProductCollection.SMARTPHONE,
    search: "",
  });

  const [searchText, setSearchText] = useState<string>("");
  const history = useHistory();

  useEffect(() => {
    // Data fetch
    const product = new ProductService();
    product
      .getProducts(productSearch)
      .then((data) => {
        console.log("data: ", data);
        setProducts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [productSearch]);

  useEffect(() => {
    if (searchText === "") {
      productSearch.search = "";
      setProductSearch({ ...productSearch });
    }
  }, [searchText]);

  // // HANDLERS
  const searchCollectionHandler = (collection: ProductCollection) => {
    productSearch.page = 1;
    productSearch.productCollection = collection;
    setProductSearch({ ...productSearch });
  };

  const searchOrderHandler = (order: string) => {
    productSearch.page = 1;
    productSearch.order = order;
    setProductSearch({ ...productSearch });
  };

  const searchProductHandler = () => {
    productSearch.search = searchText;
    setProductSearch({ ...productSearch });
  };

  const paginationHandler = (e: ChangeEvent<any>, value: number) => {
    productSearch.page = value;
    setProductSearch({ ...productSearch });
  };

  const chooseDishHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

  return (
    <>
      <Container>
        <Stack className="products">
          <Stack className="title">
            <Stack
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "50px",
                overflow: "hidden",
                justifyContent: "center",
                boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div
                style={{ position: "relative", width: "100%", height: "60px" }}
              >
                <input
                  type="search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") searchProductHandler();
                  }}
                  style={{
                    width: "100%",
                    borderRadius: "50px",
                    height: "60px",
                    paddingLeft: "40px",
                    boxSizing: "border-box",
                  }}
                />
                <SearchIcon
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#aaa",
                  }}
                />
              </div>
            </Stack>
          </Stack>

          <Stack sx={{ margin: "20px 20px" }}>
            <Stack>
              <CssVarsProvider>
                <CardOverflow
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "20px",
                  }}
                >
                  <Button
                    variant="solid"
                    color={
                      productSearch.order === "productOnSale"
                        ? "danger"
                        : "neutral"
                    }
                    className={"order"}
                    onClick={() => searchOrderHandler("productOnSale")}
                    size="lg"
                  >
                    SALE
                  </Button>
                  <Button
                    variant="solid"
                    color={
                      productSearch.order === "productPrice"
                        ? "danger"
                        : "neutral"
                    }
                    size="lg"
                    className={"order"}
                    onClick={() => searchOrderHandler("productPrice")}
                  >
                    PRICE
                  </Button>
                  <Button
                    variant="solid"
                    color={
                      productSearch.order === "createdAt" ? "danger" : "neutral"
                    }
                    size="lg"
                    className={"order"}
                    onClick={() => searchOrderHandler("createdAt")}
                  >
                    NEW
                  </Button>
                  <Button
                    variant="solid"
                    color={
                      productSearch.order === "productOrder"
                        ? "danger"
                        : "neutral"
                    }
                    size="lg"
                    className={"order"}
                    onClick={() => searchOrderHandler("productOrder")}
                  >
                    ORDER
                  </Button>
                </CardOverflow>
              </CssVarsProvider>
            </Stack>
          </Stack>

          <Stack sx={{ margin: "0px 20px" }}>
            <CssVarsProvider>
              <CardOverflow
                sx={{ display: "flex", flexDirection: "row", gap: "20px" }}
              >
                <Button
                  variant="solid"
                  color={
                    productSearch.productCollection ===
                    ProductCollection.SMARTPHONE
                      ? "danger"
                      : "neutral"
                  }
                  size="lg"
                  className={"order"}
                  onClick={() =>
                    searchCollectionHandler(ProductCollection.SMARTPHONE)
                  }
                >
                  <SmartphoneIcon sx={{ marginRight: "5px" }} />
                  Smartphone
                </Button>

                <Button
                  variant="solid"
                  color={
                    productSearch.productCollection === ProductCollection.TABLET
                      ? "danger"
                      : "neutral"
                  }
                  size="lg"
                  className={"order"}
                  onClick={() =>
                    searchCollectionHandler(ProductCollection.TABLET)
                  }
                >
                  <TabletIcon sx={{ marginRight: "5px" }} /> Tablet
                </Button>

                <Button
                  variant="solid"
                  color={
                    productSearch.productCollection === ProductCollection.LAPTOP
                      ? "danger"
                      : "neutral"
                  }
                  size="lg"
                  className={"order"}
                  onClick={() =>
                    searchCollectionHandler(ProductCollection.LAPTOP)
                  }
                >
                  <LaptopIcon sx={{ marginRight: "5px" }} /> Laptop
                </Button>

                <Button
                  variant="solid"
                  color={
                    productSearch.productCollection ===
                    ProductCollection.SMARTWATCH
                      ? "danger"
                      : "neutral"
                  }
                  size="lg"
                  className={"order"}
                  onClick={() =>
                    searchCollectionHandler(ProductCollection.SMARTWATCH)
                  }
                >
                  <WatchIcon sx={{ marginRight: "5px" }} /> Smartwatch
                </Button>

                <Button
                  variant="solid"
                  color={
                    productSearch.productCollection ===
                    ProductCollection.HEADPHONE
                      ? "danger"
                      : "neutral"
                  }
                  size="lg"
                  className={"order"}
                  onClick={() =>
                    searchCollectionHandler(ProductCollection.HEADPHONE)
                  }
                >
                  <HeadphonesIcon sx={{ marginRight: "5px" }} /> Headphone
                </Button>

                <Button
                  variant="solid"
                  color={
                    productSearch.productCollection === ProductCollection.OTHER
                      ? "danger"
                      : "neutral"
                  }
                  size="lg"
                  className={"order"}
                  onClick={() =>
                    searchCollectionHandler(ProductCollection.OTHER)
                  }
                >
                  <DevicesOtherIcon sx={{ marginRight: "5px" }} /> Other
                </Button>
              </CardOverflow>
            </CssVarsProvider>
          </Stack>

          <Stack className="list-category-section">
            <Stack className="product-wrapper">
              {products.length !== 0 ? (
                products.map((product: Product) => {
                  const imagePath = `${serverApi}/${product.productImages[0]}`;
                  return (
                    <Stack
                      onClick={() => chooseDishHandler(product._id)}
                      key={product._id}
                      className="product-card"
                    >
                      <CssVarsProvider key={product._id}>
                        <Card
                          sx={{
                            width: 320,
                            maxWidth: "100%",
                            boxShadow: "lg",
                          }}
                          className="card"
                          onClick={() => chooseDishHandler(product._id)}
                        >
                          <CardOverflow>
                            <AspectRatio sx={{ minWidth: 200 }}>
                              <img src={imagePath} loading="lazy" alt="" />
                            </AspectRatio>
                          </CardOverflow>
                          <CardContent>
                            <Typography level="body-xs">
                              {product.productCollection}{" "}
                              {`(Total ${product.productOrders} ordered)`}
                            </Typography>
                            <Link
                              href="#product-card"
                              fontWeight="md"
                              color="neutral"
                              textColor="text.primary"
                              overlay
                              endDecorator={<ArrowOutwardIcon />}
                            >
                              {product.productName}
                            </Link>

                            {product.productOnSale === 0 ? (
                              <Typography
                                level="title-lg"
                                sx={{ mt: 1, fontWeight: "xl" }}
                                endDecorator={
                                  <Chip
                                    component="span"
                                    size="sm"
                                    variant="soft"
                                    color="success"
                                  >
                                    {product.productOnSale}%
                                  </Chip>
                                }
                              >
                                ${product.productPrice}
                              </Typography>
                            ) : (
                              <Stack flexDirection={"row"} gap={"10px"}>
                                <Typography
                                  level="title-lg"
                                  sx={{ mt: 1, fontWeight: "xl" }}
                                  endDecorator={
                                    <Chip
                                      component="span"
                                      size="sm"
                                      variant="soft"
                                      color="success"
                                    >
                                      {product.productOnSale}%
                                    </Chip>
                                  }
                                >
                                  <s className="old-price">
                                    ${product.productPrice}
                                  </s>
                                </Typography>
                                <Typography
                                  level="title-lg"
                                  sx={{
                                    mt: 1,
                                    fontWeight: "xl",
                                    color: "#C41C1D",
                                  }}
                                >
                                  ${product.productSalePrice}
                                </Typography>
                              </Stack>
                            )}

                            <Typography level="body-sm">
                              (
                              <b>
                                {product.productLeftCount > 0 ? (
                                  `Only ${product.productLeftCount} left in stock!`
                                ) : (
                                  <span style={{ color: "#C41C1D" }}>
                                    SOLD OUT!
                                  </span>
                                )}
                              </b>
                              )
                            </Typography>
                          </CardContent>
                          <CardOverflow>
                            <Button variant="solid" color="danger" size="lg">
                              Add to cart
                            </Button>
                          </CardOverflow>
                        </Card>
                      </CssVarsProvider>
                    </Stack>
                  );
                })
              ) : (
                <Box className="no-data">Products are not available!</Box>
              )}
            </Stack>
          </Stack>
          <Stack className="pagination-section">
            <Pagination
              count={
                products.length !== 0
                  ? productSearch.page + 1
                  : productSearch.page
              }
              page={productSearch.page}
              renderItem={(item) => (
                <PaginationItem
                  components={{ previous: ArrowBack, next: ArrowForward }}
                  {...item}
                  color={"secondary"}
                />
              )}
              // onChange={paginationHandler}
            />
          </Stack>
        </Stack>
      </Container>

      <div className="brands-logo">
        <Container>
          <Stack
            flexDirection={"column"}
            alignItems="center"
            justifyContent={"center"}
            gap={"59px"}
          >
            <Box className="brands-title">Our Family Brands</Box>
            <Stack className="cards-holder">
              <Box className="brand-card">
                <img
                  src="/img/gurme.webp"
                  alt="/img/gurme.webp"
                  width={"250px"}
                  height={"330px"}
                />
              </Box>
              <Box className="brand-card">
                <img
                  src="/img/seafood.webp"
                  alt="/img/seafood.webp"
                  width={"250px"}
                  height={"330px"}
                />
              </Box>
              <Box className="brand-card">
                <img
                  src="/img/sweets.webp"
                  alt="/img/sweets.webp"
                  width={"250px"}
                  height={"330px"}
                />
              </Box>
              <Box className="brand-card">
                <img
                  src="/img/doner.webp"
                  alt="/img/doner.webp"
                  width={"250px"}
                  height={"330px"}
                />
              </Box>
            </Stack>
          </Stack>
        </Container>
      </div>

      <div className="address">
        <Container>
          <Stack className="address-area">
            <Box className="category-title">Our address</Box>
            <iframe
              className="iframe"
              style={{ marginTop: "60px" }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2998.058020369046!2d69.20311957628236!3d41.28584170228747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8a31ca66d417%3A0x5755ff29b7bf33a!2sRayhon%20National%20Meals%20Restaurant!5e0!3m2!1sen!2s!4v1720933891847!5m2!1sen!2s"
              width={"1204"}
              height={"504"}
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Stack>
        </Container>
      </div>
    </>
  );
}
