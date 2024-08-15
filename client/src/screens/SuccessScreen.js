import queryString from "query-string";
import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingOverlay from "../components/Loading/LoadingOverlay";
import Message from "../components/Message/Message";
import axios from "axios";

const SuccessScreen = () => {
  const { id } = useParams();
  const location = useLocation();
  const { payment_id } = queryString.parse(location.search);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState({});

  const paymentVerifiedKey = `paymentVerified_${id}_${payment_id}`;
  const paymentVerified = localStorage.getItem(paymentVerifiedKey);
  useEffect(() => {
    const verifyPayment = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`/api/verify/${id}/${payment_id}`);
          setOrder(response.data.order); 
          localStorage.setItem(paymentVerifiedKey, 'true');
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || error.message || "Une erreur est survenue";
        setMessage(errorMessage);
        
      } finally {
        setLoading(false);
      }
    };

    if (!paymentVerified && id && payment_id) {
      verifyPayment();
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, payment_id, paymentVerified]);


  const formattedDate = order
    ? new Date(order.paidAt).toLocaleDateString("fr-TN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Africa/Tunis",
      })
    : "";

  return (
    <div className="success-container">
      {loading ? (
        <LoadingOverlay overlay={true} />
      ) : message ? (
        <p style={{ color: "red" }}>{message}</p>
      ) : order ? (
        <div className="success-content">
          <div className="success-icon">
            <img src="/images/CheckCircle.svg" alt="checkcircle" />
          </div>
          <h2>Your order is successfully payed</h2>
          <p>
            Pellentesque sed lectus nec tortor tristique accumsan quis dictum
            risus. Donec volutpat mollis nulla non facilisis.
          </p>
          <div className="order-details">
            <p>
              <strong>Order code:</strong> {order._id}
            </p>
            <p>
              <strong>Date:</strong> {formattedDate}
            </p>
            <p>
              <strong>Total:</strong> {order.totalPrice}
            </p>
            <p>
              <strong>Payment method:</strong>
              {order.paymentMethod === "Cash on Delivery" ? (
                <span>Cash payed</span>
              ) : (
                <span>Credit Card</span>
              )}
            </p>
          </div>
          <Link to={`/detail/${order._id}`} className="button">
            Purchase History
          </Link>
        </div>
      ) : (
        <Message variant="danger">Order not found</Message>
      )}
    </div>
  );
};

export default SuccessScreen;
