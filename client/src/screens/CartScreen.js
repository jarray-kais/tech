import { useContext } from 'react';
import Message from "../components/Message/Message";
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Context/CartContext';
import { findproduct, viewProduct } from '../API';
import { useMutation } from '@tanstack/react-query';


const CartScreen = () => {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
      cart: { cartItems },
      userInfo
    } = state;
    const UpdateCartHandler = async (item, quantity) => {
      const { data: productdetail } = await findproduct(item._id);
      if (productdetail && productdetail.countInStock < quantity) {
        window.alert('Sorry. Product is out of stock');
        return;
      }
      ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload: { ...item, quantity },
      });
    };

    
      const removeItemHandler = (item) => {
        ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
      };
    
      const checkoutHandler = () => {
        if(cartItems && cartItems.length){
            if(userInfo){
          navigate('/shipping');
        }else{
          navigate('/signin?redirect=/shipping');

        }
        }else{
          alert('Cart is Empty')
        }
      
        
      };

      const mutateView = useMutation({
        mutationFn :(id)=> viewProduct(id),
        onSuccess: (data) =>{
          navigate(`/product/${data.product._id}`)
        }
      })
      
      const handleClick = (e , id) => {
        if(userInfo){
           e.preventDefault();
        mutateView.mutate(id)
        } else{
          navigate(`/product/${id}`)
        }
      };
    return (
      <div className="cart-container">
        <div className="cart-left">
          <h1>Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <Message>
              Cart Is Empty <Link to="/">Go Shopping</Link>
            </Message>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="cart-item-details">
                  <Link to={`/product/${item._id}`} className="cart-item-name" 
                   onClick={(e) => handleClick(e, item._id)}
                   >
                    <img src={item.image[0].url} alt={item.name} className="cart-item-image" />
                    </Link>
                    <div className="cart-item-info">
                      <Link to={`/product/${item._id}`} className="cart-item-name"
                       onClick={(e) => handleClick(e, item._id)}
                       >
                        {item.name}
                      </Link>
                      <div className="cart-item-price">${item.price}</div>
                    </div>
                  </div>
                  <div className="cart-item-actions">
                  
                    <button
                      onClick={() => UpdateCartHandler(item, item.quantity - 1)}
                      className="quantity-btn"
                      disabled={item.quantity === 1}
                    >
                      -
                    </button>
                    <span className="cart-item-quantity">{item.quantity}</span>
                    <button
                      onClick={() => UpdateCartHandler(item, item.quantity + 1)}
                      className="quantity-btn"
                      disabled={item.quantity === item.countInStock}
                    >
                      +
                    </button>
                
                    <button
                      onClick={() => removeItemHandler(item)}
                      className="remove-btn"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                    <div className="cart-item-total">${item.price * item.quantity}</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="cart-right">
          <div className="cart-summary">
            <h2>Cart Summary</h2>
            <div className="summary-item">
              <span>Total Amount in Cart</span>
              <span>TND{" "}{cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}</span>
            </div>
            <div className="summary-item">
              <span>Shipping Fee</span>
              <span>TND{" "} {cartItems.reduce((a, c) => a + c.price * c.quantity, 0) > 1000 ? 'Free' : '20'}</span>
            </div>
            <div className="summary-item">
              <span>Total Amount</span>
              <span>TND{" "} {cartItems.reduce((a, c) => a + c.price * c.quantity, 0) + (cartItems.reduce((a, c) => a + c.price * c.quantity, 0) > 1000 ? 0 : 20)}</span>
            </div>
            <button onClick={checkoutHandler} className="checkout-btn">
              Checkout
            </button>
          </div>
        </div>
      </div>
    );
};

export default CartScreen;
