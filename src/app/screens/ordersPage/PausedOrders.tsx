import Button from "@mui/material/Button";
import { TabPanel } from "@mui/joy";
import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePausedOrders } from "./selector";
import { Messages, serverApi } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { T } from "../../../lib/types/common";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderSerivce";

const pausedOrdersRetriever = createSelector(
  retrievePausedOrders,
  (pausedOrders) => ({ pausedOrders })
);

interface PausedOrdersProps {
  setValue: (input: string) => void;
}

export default function PausedOrders(props: PausedOrdersProps) {
  const { setValue } = props;
  const { pausedOrders } = useSelector(pausedOrdersRetriever);
  const { authMember, setOrderBuilder } = useGlobals();

  // HANDLERS
  const deleteOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.DELETE,
      };

      const confirmation = window.confirm("Do you want to delete the order?");
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);

        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err);
    }
  };

  const processOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      // PAYMENT PROCESS

      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.PROCESS,
      };

      const confirmation = window.confirm(
        "Do you want to proceed with payment?"
      );
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setValue("2");
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err);
    }
  };

  return (
    <Stack className="order-main-content">
      {pausedOrders?.map((order: Order) => {
        return (
          <Box key={order._id} className="order-main-box">
            <Box className="order-box-scroll">
              {order?.orderItems.map((item: OrderItem) => {
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

              <Button
                value={order._id}
                variant="contained"
                className="cancel-button"
                color="secondary"
                onClick={deleteOrderHandler}
              >
                Cancel
              </Button>
              <Button
                value={order._id}
                variant="contained"
                className="pay-button"
                onClick={processOrderHandler}
              >
                Payment
              </Button>
            </Box>
          </Box>
        );
      })}

      {!pausedOrders ||
        (pausedOrders.length === 0 && (
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
