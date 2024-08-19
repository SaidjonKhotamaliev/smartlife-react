import React from "react";
import { Box, Container, Stack } from "@mui/material";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";

import {
  AspectRatio,
  CardContent,
  CardCover,
  CssVarsProvider,
  Typography,
} from "@mui/joy";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveTopUsers } from "./selector";
import { serverApi } from "../../../lib/config";
import { Product } from "../../../lib/types/product";

const topUsersRetriever = createSelector(retrieveTopUsers, (activeUsers) => ({
  activeUsers,
}));

export default function ActiveUsers() {
  const { activeUsers } = useSelector(topUsersRetriever);
  return (
    <div className="active-users-frame">
      <Container>
        <Stack className="main">
          <Box className="category-title">Active Users</Box>
          <Stack className="cards-frame">
            <CssVarsProvider>
              {activeUsers.length !== 0 ? (
                activeUsers.map((product: Product) => {
                  const imagePath = `${serverApi}/${product.productImages}`;
                  return (
                    <Card className="card" key={product._id}>
                      <CardOverflow>
                        <AspectRatio ratio={1}>
                          <img src={imagePath} alt="image here" />
                        </AspectRatio>
                      </CardOverflow>

                      <CardOverflow className="member-nickname">
                        <Box>
                          <Typography>{product.productName}</Typography>
                        </Box>
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
