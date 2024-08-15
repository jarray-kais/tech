import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { findOrder, initiatePayment, sendcashPayment } from "../API";
import LoadingOverlay from "../components/Loading/LoadingOverlay";
import Message from "../components/Message/Message";
import { useState } from "react";
import Loading from "../components/Loading/Loading";

const OrderScreen = () => {
  const navigate = useNavigate()
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => findOrder(id),
    refetchInterval: 60000,
    staleTime: 10000,
  });

  const mutation = useMutation({
    mutationFn: initiatePayment,
    onSuccess: (data) => {
      window.location.href = data.result.link
      setLoading(false);
      setIsSuccess(true);
      
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      setMessage(errorMessage);
      setIsSuccess(false);
      setLoading(false);
    },
  });

  const cashPaymentMutation  = useMutation({
    mutationFn: sendcashPayment,
    onSuccess: () => {
      setLoading(false);
      setIsSuccess(true);
      navigate(`/${id}/cashpay`)
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      setMessage(errorMessage);
      setIsSuccess(false);
      setLoading(false);
    },
  });

  const handlecashPayment=(e)=>{
    e.preventDefault();
    setLoading(true);
    setIsSuccess(false);
    cashPaymentMutation.mutate(id);
  }


  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);
    setIsSuccess(false);
    if (order.totalPrice) {
      mutation.mutate({ id, totalPrice: order.totalPrice });
    }
  };


  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{error.message}</Message>
      ) : (
        <>
          <h1 style={{ marginLeft: "50px" }}>Order {id}</h1>
          <div className="place-order-container">
            <div className="left-section">
              <div className="box">
                <h2>Shipping</h2>
                <p>
                  <strong>Name :</strong> {order.shippingAddress.fullName}
                </p>
                <p>
                  <strong>Address :</strong> {order.shippingAddress.address}
                </p>
              </div>
              <div className="box">
                <h2>Payment</h2>
                <p>
                  <strong>Method:</strong> {order.paymentMethod}
                </p>
              </div>
              <div className="box">
                <h2>Order Items</h2>
                {order.orderItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-info">
                      <Link to={`/product/${item._id}`}>
                        <img
                          src={"/" + item.image}
                          alt={item.name}
                          className="item-image"
                        />
                      </Link>
                      <div>
                        <p>
                          <strong>{item.name}</strong>
                        </p>
                        <p>
                          TND {item.price} x {item.qty} =TND{" "}
                          {item.price * item.qty}
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

                <p>
                  <strong>Items:</strong> {order.itemsPrice.toFixed(2)} TND
                </p>
                <p>
                  <strong>Shipping:</strong> {order.shippingPrice.toFixed(2)}{" "}
                  TND
                </p>
                <p>
                  <strong>Tax:</strong> {order.taxPrice.toFixed(2)} TND
                </p>
                <p>
                  <strong>Total:</strong> {order.totalPrice.toFixed(2)} TND
                </p>
                {
                  order.paymentMethod=== "Flouci" ? <button className="place-order" onClick={handlePayment} >
                  <img src="/images/flouci.svg" alt="flouci" />
                </button>
                : order.paymentMethod=== "Cash on Delivery" ?  <button onClick={handlecashPayment} className="place-order" >cash on delivery</button>
                : null
                }
                
                {loading && <LoadingOverlay overlay={true} />}
                {isSuccess && (
                  <Message variant="success">
                    Payment was successfully sended.
                  </Message>
                )}
                {message && <p style={{ color: "red" }}>{message}</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderScreen;
