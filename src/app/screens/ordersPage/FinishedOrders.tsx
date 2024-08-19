import Button from "@mui/material/Button";
import { TabPanel } from "@mui/joy";
import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import moment from "moment";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveFinishedOrders } from "./selector";
import { serverApi } from "../../../lib/config";
import { Order, OrderItem } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";

const finishedOrdersRetriever = createSelector(
  retrieveFinishedOrders,
  (finishedOrders) => ({ finishedOrders })
);

export default function FinishedOrders() {
  const { finishedOrders } = useSelector(finishedOrdersRetriever);

  return (
    <Stack>
      {finishedOrders?.map((order: Order) => {
        return (
          <Box key={order._id} className="order-main-box">
            <Box className="order-box-scroll">
              {order.orderItems.map((item: OrderItem) => {
                const product = order.productData.filter(
                  (ele: Product) => ele._id === item.productId
                )[0];
                const imagePath = `${serverApi}/${product.productImages[0]}`;
                return (
                  <Box className="orders-name-price" key={item._id}>
                    <img
                      src={imagePath}
                      alt="order-img"
                      className="order-dish-img"
                    />
                    <p className="title-dish">{product.productName}</p>
                    <Box className="price-box">
                      <p>${item.itemPrice}</p>
                      <img src="/icons/close.svg" alt="close.svg" />
                      <p>{item.itemQuantity}</p>
                      <img src="/icons/pause.svg" alt="pause.svg" />
                      <p style={{ marginLeft: "15px" }}>
                        ${item.itemPrice * item.itemQuantity}
                      </p>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            <Box className="total-price-box">
              <Box className="box-total">
                <p>Product price</p>
                <p>${order.orderTotal - order.orderDelivery}</p>
                <img
                  src="/icons/plus.svg"
                  alt="plus.svg"
                  style={{ marginLeft: "20px" }}
                />
                <p>Delivery cost</p>
                <p>${order.orderDelivery}</p>
                <img
                  src="/icons/pause.svg"
                  alt="pause.svg"
                  style={{ marginLeft: "20px" }}
                />
                <p>Total</p>
                <p>${order.orderTotal}</p>
              </Box>
            </Box>
          </Box>
        );
      })}

      {!finishedOrders ||
        (finishedOrders.length === 0 && (
          <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
            <img
              src="/icons/noimage-list.svg"
              alt="noimage.svg"
              style={{ width: "300px", height: "300px" }}
            />
          </Box>
        ))}
    </Stack>
  );
}
