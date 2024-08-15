import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Message from "../components/Message/Message";

const TrackOrderScreen = () => {
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (orderId) {
      navigate(`/detail/${orderId}`);
    } else {
      setMessage("Please enter an order ID");
    }
  };

  return (
    <div className="track-order-container">
      <h2>Track Order</h2>
      <p>
        To track your order please enter your order ID in the input field below
        and press the “Track Order” button. This was given to you on your
        receipt and in the confirmation email you should have received.
      </p>
      <div className="track-order-form">
        <input
          type="text"
          placeholder="Order ID..."
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <div className="order-id-info">
        <i className="fa fa-info-circle info-icon " aria-hidden="true"></i>
          Order ID that we sent to you in your email address.
        </div>
        <div className="pay-action-buttons">
          <button onClick={handleTrackOrder} className="primary">
            TRACK ORDER
          </button>
        </div>

        {message && <Message variant="danger">{message}</Message>}
      </div>
    </div>
  );
};

export default TrackOrderScreen;
