import { useContext, useEffect, useState } from "react";
import { Store } from "../Context/CartContext";
import CheckoutSteps from "../components/Chekout/CheckoutSteps";
import { Link, useNavigate } from "react-router-dom";
import { findproduct, placeOrder, viewProduct } from "../API";
import { useMutation } from "@tanstack/react-query";
import Loading from "../components/Loading/LoadingOverlay";
import Message from "../components/Message/Message";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart , userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const UpdateCartHandler = async (item, quantity) => {
    const { data: productdetail } = await findproduct(item._id);

    if (productdetail && productdetail.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }

    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const mutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: (data) => {
      console.log(data);
      setMessage("Order placed successfully");
      ctxDispatch({ type: "CART_CLEAR" });
      localStorage.removeItem("cartItems");
      navigate(`/order/${data.order._id}`);
      setIsLoading(false);
      setIsSuccess(true);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      setMessage(errorMessage);
      setIsSuccess(false);
      setIsLoading(false);
    },
  });

  const orders = {
    orderItems: cart.cartItems.map((item) => ({
      name: item.name,
      image: item.image[0].url,
      price: item.price,
      product: item._id,
      qty: item.quantity,
      seller :item.seller,
    })),
    shippingAddress: cart.shippingAddress,
    paymentMethod: cart.paymentMethod,
    itemsPrice: cart.itemsPrice,
    shippingPrice: cart.shippingPrice,
    taxPrice: cart.taxPrice,
    totalPrice: cart.totalPrice,
  };

  console.log(orders.orderItems.seller)

  const placeOrderHandler = () => {
    setIsLoading(true);
    setIsSuccess(false);
    mutation.mutate(orders);
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);

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
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <div className="place-order-container">
        <div className="left-section">
          <div className="box">
            <h2>Shipping</h2>
            <p>
              <strong>Name :</strong> {cart.shippingAddress.fullName}
            </p>
            <p>
              <strong>Address :</strong> {cart.shippingAddress.address}
            </p>
          </div>
          <div className="box">
            <h2>Payment</h2>
            <p>
              <strong>Method:</strong> {cart.paymentMethod}
            </p>
          </div>
          <div className="box">
            <h2>Order Items</h2>
            {cart.cartItems.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-info">
                  <Link to={`/product/${item._id}`}
                  onClick={(e) => handleClick(e, item._id)}
                  >
                    <img
                      src={item.image[0].url}
                      alt={item.name}
                      className="item-image"
                    />
                  </Link>
                  <div>
                    <p>
                      <strong>{item.name}</strong>
                    </p>
                    <p>
                      TND {item.price} x {item.quantity} =TND{" "}
                      {item.price * item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="right-section">
          <div className="box order-summary">
            <h2>Order summary</h2>
            {cart.cartItems.map((item, index) => (
              <div key={index} className="summary-item">
                <img
                  src={item.image[0].url}
                  alt={item.name}
                  className="item-image"
                />
                <div className="item-details">
                  <p>
                    <strong>{item.name}</strong>
                  </p>

                  <p>
                    ${item.price} x {item.quantity}
                  </p>
                </div>
                <div className="item-actions">
                  <button
                    onClick={() => UpdateCartHandler(item, item.quantity - 1)}
                    disabled={item.quantity === 1}
                  >
                    -
                  </button>
                  <input type="number" value={item.quantity} readOnly />
                  <button
                    onClick={() => UpdateCartHandler(item, item.quantity + 1)}
                    disabled={item.quantity === item.countInStock}
                  >
                    +
                  </button>
                </div>
                <button
                  className="remove-item"
                  onClick={() => removeItemHandler(item)}
                >
                  ✖
                </button>
              </div>
            ))}
            <div className="horizontalline"></div>

            <p>
              <strong>Items:</strong> {cart.itemsPrice.toFixed(2)} TND
            </p>
            <p>
              <strong>Shipping:</strong> {cart.shippingPrice.toFixed(2)} TND
            </p>
            <p>
              <strong>Tax:</strong> {cart.taxPrice.toFixed(2)} TND
            </p>
            <p>
              <strong>Total:</strong> {cart.totalPrice.toFixed(2)} TND
            </p>
            <button className="place-order" onClick={placeOrderHandler}>
              Place Order
            </button>
            <Loading overlay={isLoading} />
            {isSuccess && (
              <Message variant="success">Email sent successfully</Message>
            )}
            {message && <p style={{ color: "red" }}>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
