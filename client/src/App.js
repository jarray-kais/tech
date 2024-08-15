import { Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import SigningScreen from "./screens/signingScreen";
import SignupScreen from "./screens/signupScreen";
import TermsScreen from "./screens/TermsScreen";
import Forgetpassword from "./screens/Forgetpassword";
import ResetPassword from "./screens/ResetPassword";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import SignupSellerScreen from "./screens/SignupSellerScreen";
import ProfileScreen from "./screens/ProfileScreen";
import Auth from "./components/Auth";
import SearchScreen from "./screens/SearchScreen";
import ProductdetailsScreen from "./screens/ProductdetailsScreen";
import CartScreen from "./screens/CartScreen";
import ShippingScreen from "./screens/ShippingScreen";
import MapScreen from "./screens/MapScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import SuccessScreen from "./screens/SuccessScreen";
import FailScreen from "./screens/FailScreen";
import CashPayDelevery from "./screens/CashPayDelevery";
import DashboardUser from "./screens/DashboardUser";
import Seller from "./components/Seller";
import Admin from "./components/Admin";
import DashboardSeller from "./screens/DashboardSeller";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import OrderDetails from "./screens/OrderDetails";
import TrackOrderScreen from "./screens/TrackOrderScreen";
import BrowsingHistory from "./screens/BrowsingHistory";
import UserListScreen from "./screens/UserListScreen";
import EditUser from "./screens/EditUser";
import ProductListscreen from "./screens/ProductListscreen";
import EditProduct from "./screens/EditProduct";
import CreateProduct from "./screens/CreateProduct";
import DashboardAdmin from "./screens/DashboardAdmin";
import { useEffect } from "react";
import PromotionScreen from "./screens/PromotionScreen";
import SellerScreen from "./screens/SellerScreen";



function App() {
  useEffect(() => {
    function trackVisits() {
      let visitCount = localStorage.getItem('visitCount');
      
      if (visitCount === null) {
        visitCount = 1;
      } else {
        visitCount = parseInt(visitCount, 10) + 1;
      }
      
      localStorage.setItem('visitCount', visitCount);
      
      console.log('Visit Count:', visitCount);
    }

    trackVisits();
  }, []);

  return (
    <div> 
    <Header />
    <main>
    <Routes>
      <Route path={"/"} element=<HomeScreen /> />
      <Route path={"/search"} element=<SearchScreen /> />
      <Route path={"/signin"} element=<SigningScreen /> />
      <Route path={"/register"} element=<SignupScreen /> />
      <Route path={"/cart"} element=<CartScreen /> />
      <Route path={"/shipping"} element=<ShippingScreen /> />
      <Route path={"/payment"} element=<PaymentMethodScreen /> />
      <Route path={"/placeorder"} element=<PlaceOrderScreen /> />
      <Route path={"/order/:id"} element=<OrderScreen /> />
      <Route path={"/success/:id?"} element=<SuccessScreen /> />
<Route path={"/:id/cashpay"} element=<CashPayDelevery /> />
      <Route path={"/fail"} element=<FailScreen /> />
      
      <Route path={"product/:id"} element=<ProductdetailsScreen /> />
      <Route path={"/profile"} element={<Auth><ProfileScreen/></Auth>} exact/>
      <Route path={"/register-seller"} element=<SignupSellerScreen /> />
      <Route path={"/terms"} element=<TermsScreen /> />
      <Route path={"/forget-password"} element=<Forgetpassword /> />
      <Route path={"/reset-password/:token"} element=<ResetPassword /> />
      <Route path={"/seller/:id"} element={<SellerScreen />} />
      <Route path={"/map"} element={<Auth><MapScreen /></Auth>} />
      <Route path={"/userdash"} element={<Auth><DashboardUser /></Auth>} />
      <Route path={"/orderhistory"} element={<Auth><OrderHistoryScreen /></Auth>} />
      <Route path={"/detail/:id"} element={<Auth><OrderDetails /></Auth>} />
      <Route path={"/track"} element={<Auth><TrackOrderScreen /></Auth>} />
      <Route path={"/history"} element={<Auth><BrowsingHistory /></Auth>} />
      <Route path={"/sellerdash"} element={<Seller><DashboardSeller /></Seller>} />
      <Route path={"/productlist"} element={<Seller><ProductListscreen /></Seller>} />
      <Route path={"/edit/:id"} element={<Seller><EditProduct /></Seller>} />
      <Route path={"/create"} element={<Seller><CreateProduct /></Seller>} />
      <Route path={"/user"} element={<Admin><UserListScreen /></Admin>} />
      <Route path={"/:id/promotion"} element={<Admin><PromotionScreen /></Admin>} />
      <Route path={"/user/:id"} element={<Admin><EditUser /></Admin>} />
      <Route path={"/admindash"} element={<Admin><DashboardAdmin /></Admin>} />
     
      
    

    </Routes>
     </main>
      <Footer/>
    </div>
  );
}

export default App;
