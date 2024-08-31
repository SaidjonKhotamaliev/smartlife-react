import React from "react";
import { Box, Container, Stack } from "@mui/material";
import { CssVarsProvider } from "@mui/joy/styles";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePopularProducts } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";
import { useHistory } from "react-router-dom";
import { AspectRatio, Button, Chip, Link } from "@mui/joy";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { CartItem } from "../../../lib/types/search";

const propularDishesRetriever = createSelector(
  retrievePopularProducts,
  (popularProducts) => ({ popularProducts })
);

interface HomePageProps {
  onAdd: (item: CartItem) => void;
}

export default function PopularDishes(props: HomePageProps) {
  const { popularProducts } = useSelector(propularDishesRetriever);
  const { onAdd } = props;
  const history = useHistory();

  const chooseDishHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

  return (
    <div className="popular-dishes-frame">
      <Container>
        <Stack className="popular-section">
          <Box className="category-title">Most favourite products</Box>
          <Stack className="cards-frame">
            {popularProducts.length !== 0 ? (
              popularProducts.map((product: Product) => {
                const imagePath = `${serverApi}/${product.productImages[0]}`;
                return (
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
                              sx={{ mt: 1, fontWeight: "xl", color: "#C41C1D" }}
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
                        <Button
                          variant="solid"
                          color="danger"
                          size="lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAdd({
                              _id: product._id,
                              quantity: 1,
                              price:
                                product.productOnSale > 0
                                  ? product.productSalePrice
                                  : product.productPrice,
                              name: product.productName,
                              image: product.productImages[0],
                            });
                          }}
                        >
                          Add to cart
                        </Button>
                      </CardOverflow>
                    </Card>
                  </CssVarsProvider>
                );
              })
            ) : (
              <Box className="no-data">Popular products are not available!</Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
