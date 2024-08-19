import { Member } from "./member";
import { Order } from "./order";
import { Product } from "./product";

// REACT APP STATE
export interface AppRootState {
  homePage: HomePageState;
  productsPage: ProductsPageState;
  ordersPage: OrdersPageState;
}

// HOMEPAGE
export interface HomePageState {
  popularDishes: Product[];
  newDishes: Product[];
  topUsers: Member[];
}

// PRODUCTSPAGE
export interface ProductsPageState {
  products: Product[];
  restaurant: Member | null;
  chosenProduct: Product | null;
}

// ORDERSPAGE
export interface OrdersPageState {
  pausedOrders: Order[];
  processOrders: Order[];
  finishedOrders: Order[];
}
