import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import Dashboard from "../pages/dashboard";
import Home from "../pages/home";
import Checkout from "../pages/home/checkout";
import Login from "../pages/home/login";
import ProductDetail from "../pages/home/product";
import Product from "../pages/product";
import Register from "../pages/home/register";
import Order from "../pages/order";
import Category from "../pages/home/category";
import OrderDetail from "../pages/order/detail";
import OrderUser from "../pages/home/order";
import Rent from "../pages/home/rent";
import Cart from "../pages/home/cart";
import About from "../pages/home/about";
import Contact from "../pages/home/contact";

const routes = [
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/",
    Component: Home,
    Layout: UserLayout,
  },
  {
    path: "/product/:id",
    Component: ProductDetail,
    Layout: UserLayout,
  },
  {
    path: "/products/:category",
    Component: Category,
    Layout: UserLayout,
  },
  {
    path: "/cart",
    Component: Cart,
    Layout: UserLayout,
  },
  {
    path: "/checkout",
    Component: Checkout,
    Layout: UserLayout,
  },
  {
    path: "/orders",
    Component: OrderUser,
    Layout: UserLayout,
  },
  {
    path: "rent",
    Component: Rent,
    Layout: UserLayout,
  },
  {
    path: "/admin/",
    Component: Dashboard,
    Layout: AdminLayout,
  },
  {
    path: "/admin/products",
    Component: Product,
    Layout: AdminLayout,
  },
  {
    path: "/admin/orders",
    Component: Order,
    Layout: AdminLayout,
  },
  {
    path: "/admin/order/:id",
    Component: OrderDetail,
    Layout: AdminLayout,
  },{
    path: "/contact",
    Component: Contact,
  },
  {
    path: "/about",
    Component: About,
  }
];

export default routes;
