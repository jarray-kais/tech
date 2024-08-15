import { useContext } from 'react';
import { Store } from '../../Context/CartContext';
import { Link } from 'react-router-dom';
import '../Header/Header.css';
import { useMutation } from '@tanstack/react-query';
import { logout } from '../../API';

const Navigationsidebaruser = () => {

    const {state , dispatch: ctxDispatch } = useContext(Store)
    const { userInfo } = state
    const mutation = useMutation({
        mutationFn : logout ,
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
      const renderLink = (to, icon, text) => (
        <Link to={to} style={{ textDecoration: 'none' }}>
          <li className="category-item user-item " id='dash-item'>
            <span>{icon}</span>
            {text}
          </li>
        </Link>
      );
    
  return (
    <div>
        {userInfo ? (
        <ul className="dashboard-list">
          {renderLink((userInfo.isAdmin ? "/admindash" : userInfo.isSeller ? "/sellerdash" : "/userdash"), <img src="/images/dashboard.svg" alt="dashboard" />, 'Dashboard')} 
          {((userInfo.isSeller || userInfo.isAdmin)||(userInfo.isSeller && userInfo.isAdmin)) && renderLink('/productlist', <img src="/images/product.svg" alt="product" />, 'Products')}
          {userInfo.isAdmin && (
            <>
              {renderLink('#', <img src="/images/Messenger.svg" alt="messenger" />, 'Support Chat')}
              {renderLink('/user', <i className="fa fa-users" aria-hidden="true"></i>, 'Users')}
            </>
          )}
          {renderLink('/orderhistory', <img src="/images/storeOrder.svg" alt="order" />, 'Order History')}
          {renderLink('/track', <i className="fa fa-map-marker" aria-hidden="true"></i>, 'Track Order')}
          {renderLink('/cart', <i className="fa fa-shopping-cart" aria-hidden="true"></i>, 'Shopping Cart')}
          {renderLink('/history', <i className="fa fa-history" aria-hidden="true"></i>, 'Browsing History')}
          {renderLink('/profile', <i className="fa fa-cog" aria-hidden="true"></i>, 'Settings')}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <li className="category-item user-item" onClick={signoutHandler}>
              <span>
                <i className="fa fa-sign-out" aria-hidden="true"></i>
              </span>
              Log-out
            </li>
          </Link>
        </ul>
      ):null
      
      }
    </div>
  )
}

export default Navigationsidebaruser