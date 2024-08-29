import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel/TabPanel";
import { Box, Container, Stack, Tab, Tabs } from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import "../../../css/orders.css";
import Divider from "../../components/divider";
import FinishedOrders from "./FinishedOrders";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { Order, OrderInquiry } from "../../../lib/types/order";
import { setFinishedOrders, setPausedOrders, setProcessOrders } from "./slice";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderSerivce";
import { useGlobals } from "../../hooks/useGlobals";
import { useHistory } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";

const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

export default function OrdersPage() {
  const history = useHistory();
  const { authMember } = useGlobals();
  const { setPausedOrders, setProcessOrders, setFinishedOrders } =
    actionDispatch(useDispatch());
  const { orderBuilder } = useGlobals();
  const [value, setValue] = useState("1");

  const [orderInquiry, setOrderInquiry] = useState<OrderInquiry>({
    page: 1,
    limit: 3,
    orderStatus: OrderStatus.PAUSE,
  });

  useEffect(() => {
    const order = new OrderService();

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PAUSE })
      .then((data) => setPausedOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PROCESS })
      .then((data) => setProcessOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.FINISH })
      .then((data) => setFinishedOrders(data))
      .catch((err) => console.log(err));
  }, [orderInquiry, orderBuilder]);

  /** HNDLERS **/

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  if (!authMember) history.push("/");
  return (
    <div className="order-page">
      <Container className="order-container">
        <Stack className="order-left">
          <TabContext value={value}>
            <Box className="order-nav-frame">
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="Basic tabs example"
                  className="table-list"
                >
                  <Tab label="PAUSED ORDERS" value="1" className="tab-panel" />
                  <Tab label="PROCESS ORDERS" value="2" />
                  <Tab label="FINISHED ORDERS" value="3" />
                </Tabs>
              </Box>
            </Box>
            <Stack className="order-main-content">
              <TabPanel value="1">
                <PausedOrders setValue={setValue} />
              </TabPanel>
              <TabPanel value="2">
                <ProcessOrders setValue={setValue} />
              </TabPanel>
              <TabPanel value="3">
                <FinishedOrders />
              </TabPanel>
            </Stack>
          </TabContext>
        </Stack>

        <Stack className="order-right">
          <Box className="order-info-box">
            <Box className="member-box">
              <div className="order-user-img">
                <img
                  src={
                    authMember?.memberImage
                      ? `${serverApi}/${authMember?.memberImage}`
                      : "/icons/default-user.svg"
                  }
                  alt="avatar here"
                  className="order-user-avatar"
                />
              </div>
              <div className="order-user-icon-box">
                <img
                  src={
                    authMember?.memberType === MemberType.RESTAURANT
                      ? "/icons/restaurant.svg"
                      : "/icons/user-badge.svg"
                  }
                  alt="user badge here"
                  className="order-user-prof-img"
                />
              </div>
              <span className="order-user-name">{authMember?.memberNick}</span>
              <span className="order-user-prof">{authMember?.memberType}</span>
              <Divider height="2" width="333" bg="#A1A1A1" />
              <Stack className="order-user-address">
                <img
                  src="/icons/location.svg"
                  alt="location.svg"
                  className=""
                />
                <span className="spec-address-txt">
                  {authMember?.memberAdress ?? "no address"}
                </span>
              </Stack>
            </Box>
          </Box>
          <Stack className="card-box">
            <Stack className="card-input">
              <Box>
                <input
                  className="card-num"
                  type={"text"}
                  placeholder={"Card number : 5243 4090 2002 7495"}
                ></input>
              </Box>
              <Stack className="card-mid-lane">
                <input
                  className="expire-num"
                  type={"text"}
                  placeholder={"07 / 24"}
                ></input>
                <input
                  className="cvv-num"
                  type={"text"}
                  placeholder={"CVV : 010"}
                ></input>
              </Stack>
              <Box>
                <input
                  type="text"
                  className="card-name"
                  placeholder={"Justin Robertson"}
                />
              </Box>
            </Stack>
            <Stack className="card-logos" flexDirection={"row"} gap={"30px"}>
              <img src="/icons/western-card.svg" />
              <img src="/icons/master-card.svg" />
              <img src="/icons/paypal-card.svg" />
              <img src="/icons/visa-card.svg" />
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
