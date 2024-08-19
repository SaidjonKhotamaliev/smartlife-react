import Button from "@mui/material/Button";
import { TabPanel } from "@mui/joy";
import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import moment from "moment";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveProcessOrders } from "./selector";
import { Messages, serverApi } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { useGlobals } from "../../hooks/useGlobals";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderSerivce";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { T } from "../../../lib/types/common";

const processOrdersRetriever = createSelector(
  retrieveProcessOrders,
  (processOrders) => ({ processOrders })
);

interface ProcessOrdersProps {
  setValue: (input: string) => void;
}

export default function ProcessOrders(props: ProcessOrdersProps) {
  const { setValue } = props;
  const { processOrders } = useSelector(processOrdersRetriever);
  const { authMember, setOrderBuilder } = useGlobals();

  // HANDLERS
  const finishOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);

      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.FINISH,
      };

      const confirmation = window.confirm(
        "Do you want to finish the procedure?"
      );
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setValue("3");
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err);
    }
  };

  return (
    <Stack>
      {processOrders?.map((order: Order) => {
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
              <Box>
                <p className="data-compl">
                  {moment().format("YY-MM-DD HH:mm")}
                </p>
              </Box>
              <Button
                value={order._id}
                variant="contained"
                className="verify-button"
                onClick={finishOrderHandler}
              >
                Verify to fulfill
              </Button>
            </Box>
          </Box>
        );
      })}

      {!processOrders ||
        (processOrders.length === 0 && (
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
