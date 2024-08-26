import React from "react";
import { Box, Container, Stack } from "@mui/material";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";

import {
  CssVarsProvider,
  Typography,
  AspectRatio,
  Button,
  Chip,
  Link,
  CardContent,
} from "@mui/joy";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveTopUsers } from "./selector";
import { serverApi } from "../../../lib/config";
import { Product } from "../../../lib/types/product";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useHistory } from "react-router-dom";

const topUsersRetriever = createSelector(retrieveTopUsers, (activeUsers) => ({
  activeUsers,
}));

export default function ActiveUsers() {
  const { activeUsers } = useSelector(topUsersRetriever);
  const history = useHistory();
  const chooseDishHandler = (id: string) => {
    history.push(`/products/${id}`);
  };
  return (
    <div className="active-users-frame">
      <Container>
        <Stack className="main">
          <Box className="category-title">Hot Deal</Box>
          <Stack className="cards-frame">
            <CssVarsProvider>
              {activeUsers.length !== 0 ? (
                activeUsers.map((product: Product) => {
                  const imagePath = `${serverApi}/${product.productImages}`;

                  return (
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
                        <Button variant="solid" color="danger" size="lg">
                          Add to cart
                        </Button>
                      </CardOverflow>
                    </Card>
                  );
                })
              ) : (
                <Box className="no-data">No products on sale now!</Box>
              )}
            </CssVarsProvider>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
