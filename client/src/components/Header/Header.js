import "./Header.css";
import { Link } from "react-router-dom";
import DropdownCategory from "./DropdownCategory";
import { useContext, useEffect, useRef, useState } from "react";
import { Store } from "../../Context/CartContext";
import SearchBar from "./SearchBar";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../API";

const Header = () => {
  const dropdownRef = useRef(null);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleButtonClick = () => {
    toggleDropdown();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const mutation = useMutation({
    mutationFn : logout ,
    onSuccess: () => {},
    onError: (error) => {
      console.error("Error in logout mutation:", error);
    }
  })

  const signoutHandler =async () => {
    try {
      await mutation.mutateAsync();
        ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);

    }
  
    
  };

  return (
    <div className="header">
      <div className="col1">
        <div className="logo">
          <Link to="/">
            <img src="/images/logo.svg" alt="logo" style={{ height: "80px" }} />
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/orders">Orders</Link>
         
          <Link to="/customer-support">Customer Support</Link>
          <Link to="/need-help">Need Help</Link>
        </div>
        <div className="become-seller">
          <Link to="/register-seller">Become a Seller</Link>
        </div>
        <div className="follow-us">
          <span>Follow us:</span>
          <Link to="https://facebook.com">
            <img src="/images/facebook.svg" alt="facebook" />
          </Link>
          <Link to="https://twitter.com">
            <img src="/images/Twitter.svg" alt="twitter" />
          </Link>
          <Link to="https://instagram.com">
            <img src="/images/instagram.svg" alt="instagram" />
          </Link>
          <Link to="https://youtube.com">
            <img src="/images/youtube.svg" alt="youtube" />
          </Link>
        </div>
      </div>
      <div className="col2">
        <DropdownCategory />
        <SearchBar />
        <div className="user-actions">
          {userInfo ? (
            <div className="all-categories" ref={dropdownRef}>
              <div onClick={handleButtonClick} className="user">
                <img
                  className="avatar"
                  src={"/"+ userInfo?.profilePicture}
                  alt="user"
                />
                <p className="user-name">{userInfo.name}</p>
              </div>

              {dropdownOpen && (
                <ul className="category-list">
                <Link to={userInfo.isAdmin ? "/admindash" : userInfo.isSeller ? "/sellerdash" : "userdash"} style={{textDecoration : "none"}}>
                  <li className="category-item user-item">
                    <span>
                      <img src="/images/dashboard.svg" alt="dashboard" />
                    </span>
                    Dashboard
                  </li></Link>
                  
                  {((userInfo.isAdmin|| userInfo.isSeller )||(userInfo.isSeller && userInfo.isAdmin))&& (
                    <Link to="/productlist" style={{textDecoration : "none"}}>
                    <li className="category-item user-item">
                      <span>
                        <img src="/images/product.svg" alt="product" />
                      </span>
                      Products
                    </li></Link>
              )}
                  {userInfo.isAdmin && (
                    <>
                    <Link to="#" style={{textDecoration : "none"}}>
                     
                      <li className="category-item user-item">
                        <span>
                          <img src="/images/Messenger.svg" alt="messenger" />
                        </span>
                        Support chat
                      </li></Link>
                      <Link to="/user" style={{textDecoration : "none"}}>
                      <li className="category-item user-item">
                        <span>
                          <i className="fa fa-users" aria-hidden="true"></i>
                        </span>
                        users
                      </li>
                      </Link>
                    </>
                  )}
                  <Link to="/orderhistory" style={{textDecoration : "none"}}>
                  <li className="category-item user-item">
                    <span>
                      <img src="/images/storeOrder.svg" alt="order" />
                    </span>
                    Order History
                  </li>
                  </Link>
                  <Link to="/track" style={{textDecoration : "none"}}>
                  <li className="category-item user-item">
                    <span>
                      <i className="fa fa-map-marker" aria-hidden="true"></i>
                    </span>
                    Track Order
                  </li>
                  </Link>
                  <Link to="/cart" style={{textDecoration : "none"}}>
                  <li className="category-item user-item">
                    <span>
                      <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                    </span>
                    Shopping Cart
                  </li>
                  </Link>
                  <Link to="/history" style={{textDecoration : "none"}}>
                  <li className="category-item user-item">
                    <span>
                      <i className="fa fa-history" aria-hidden="true"></i>
                    </span>
                    Browsing History
                  </li>
                  </Link>
                  <Link to="/profile" style={{textDecoration : "none"}}>
                  <li className="category-item user-item">
                    <span>
                      <i className="fa fa-cog" aria-hidden="true"></i>
                    </span>
                    Settings
                  </li>
                  </Link>
                  <Link to="/" style={{textDecoration : "none"}}>
                  <li
                    className="category-item user-item"
                    onClick={signoutHandler}
                  >
                    <span>
                      <i className="fa fa-sign-out" aria-hidden="true"></i>
                    </span>
                    Log-out
                  </li>
                  </Link>
                </ul>
              )}
            </div>
          ) : (
            <Link to="/signin">Sign In</Link>
          )}
          <div className="badge-cart">
            <Link to="/cart" className="nav-link">
              Cart
              {cart.cartItems.length > 0 && (
                <span className="badge-item">
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
