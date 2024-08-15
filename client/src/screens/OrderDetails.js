import { useNavigate, useParams } from "react-router-dom";
import { deleteOrder, findOrder, updateOrder } from "../API";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Navigationsidebaruser from "../components/NAvigationSideBarUser/Navigationsidebaruser";
import BackButton from "../components/BackButton/BackButton";
import OrderProgress from "../components/OrderProgress/OrderProgress";
import Loading from "../components/Loading/Loading";
import Message from "../components/Message/Message";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Context/CartContext";

const OrderDetails = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [packaging, setPackaging] = useState(false);
  const [isDelivered, setIsDelivery] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [onTheRoadBeforeDelivering, setOnTheRoadBeforeDelivering] =
    useState(false);

  const {
    data: order,
    isLoading: orderloading,
    error: ordererror,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => findOrder(id),
    rating: 1,
    refetchInterval: 60000,
    staleTime: 10000,
  });
 


  const updateMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: (data) => {
      alert("Order updated successfully");
      queryClient.invalidateQueries(["order"]);
      console.log(order);
    },
    onError: (error) => {
      console.log(error);
    },
  });
 
  const handleUpdate = () => {
    const updatedData = {
      packaging,
      isDelivered,
      isPaid,
      onTheRoadBeforeDelivering,
    };
    updateMutation.mutate({
      id: id,
      updatedData,
    });
    setIsPaid(false);
    setIsDelivery(false);
    setPackaging(false);
    setOnTheRoadBeforeDelivering(false);
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  const expectedArrival = addDays(order?.createdAt, 3);

  const getOrderActivities = (order) => {
    const activities = [];
    activities.push({
      img: "/images/verfier.svg",
      message: "Your order is successfully verified.",
      date: order?.createdAt,
    });

    if (order?.isPaid) {
      activities.push({
        img: "/images/succes.svg",
        message: "Your order is successfully payer.",
        date: order?.paidAt,
      });
    }

    if (order?.onTheRoadBeforeDelivering) {
      activities.push({
        img: "/images/mile.svg",
        message: "Your order has reached the last mile hub.",
      });
    }

    if (order?.isDelivered) {
      activities.push({
        img: "/images/delivr.svg",
        message:
          "Your order has been delivered. Thank you for shopping with us!",
      });
    }

    if (order?.packaging) {
      activities.push({
        img: "/images/package.svg",
        message: "Your order is being packaged.",
      });
    }

    return activities;
  };

  const activities = getOrderActivities(order);
  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      alert("Order deleted successfully");
      navigate("/orderhistory");
    },
  }); 
  const handleDelete = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      console.log(orderId);
      deleteMutation.mutate(orderId);
    }
  };

  const [isCanceled, setIsCanceled] = useState(false);

  useEffect(() => {
    const cancelOrder = async (id) => {
      try {
        const response = await fetch(`/api/orders/${id}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to cancel the order');
        }
        const data = await response.json();
        console.log(data);
        alert('Order canceled successfully');
        setIsCanceled(true);
      } catch (error) {
        console.error('Error canceling order:', error);
        alert('There was an error canceling the order.');
      }
    };

    if (isCanceled && id) {
      cancelOrder(id);
    }
  }, [isCanceled,id]);

  const handleCancelClick = () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setIsCanceled(true);
    }
  };
  return (
    <div className="dash">
      <div className="dash-user">
        <Navigationsidebaruser />
      </div>
      {orderloading ? (
        <Loading />
      ) : ordererror ? (
        <Message variant="danger">{ordererror?.message}</Message>
      ) : (
        <>
          <div className="dash-content">
            <div className="back">
              <div className="back1">
                <BackButton />
                <h2>Order Details</h2>
              </div>
              {userInfo && userInfo.isAdmin ? (
                <>
                  <button
                    className="action-button delete-button"
                    style={{ backgroundColor: "red", color : "#ffff"}}
                    onClick={() => handleDelete(order?._id)}
                  >
                    Delete
                  </button>
                </>
              ) : null}
              <button
                    className="action-button delete-button"
                    style={{ backgroundColor: "red", color : "#ffff"}}
                    onClick={handleCancelClick}
                  >
                    canceled
                  </button>
            </div>

            <div className="info-order">
              <div className="info1">
                <p>
                  <strong>Order ID:</strong> {order?._id}  ({order?.isCanceled ? "Canceled" : null})
                </p>
                <div className="info2">
                  <p>
                    {" "}
                    {order?.orderItems.length} <strong>Product(s)</strong>
                  </p>{" "}
                  <p>
                    <strong>Order Placed:</strong>{" "}
                    {new Date(order?.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <p>
                  <strong>Total:</strong> TND {order?.totalPrice.toFixed(2)}
                </p>
                <p>
                  <strong>Methode de payment :</strong> {order?.paymentMethod}
                </p>
              </div>
            </div>
            <div>
              <p>
                <strong>Expected Arrival:</strong>{" "}
                {new Date(expectedArrival).toLocaleDateString()}
              </p>
              <OrderProgress order={order} />
            </div>
            <div className="order-activity">
              <h3>Order Activity</h3>
              <ul>
                {activities.map((activity, index) => (
                  <li key={index} className="activity-item">
                    <img src={activity.img} alt="Activity Icon" />
                    <div>
                      <p>{activity.message}</p>
                      <p>
                        {activity.date
                          ? new Date(activity.date).toLocaleString()
                          : null}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {userInfo?.isAdmin ? (
              <div className="update">
                <div className="pay-form-group">
                  <input
                    type="radio"
                    id="packaging"
                    value="packaging"
                    checked={packaging}
                    onChange={() => setPackaging(!packaging)}
                  />
                  <label htmlFor="packaging"> packaging</label>
                </div>
                <div className="pay-form-group">
                  <input
                    type="radio"
                    id="onTheRoadBeforeDelivering"
                    value="onTheRoadBeforeDelivering"
                    checked={onTheRoadBeforeDelivering}
                    onChange={() =>
                      setOnTheRoadBeforeDelivering(!onTheRoadBeforeDelivering)
                    }
                  />
                  <label htmlFor="onTheRoadBeforeDelivering">
                    {" "}
                    On The Road
                  </label>
                </div>
                <div className="pay-form-group">
                  <input
                    type="radio"
                    id="isDelivered"
                    value="isDelivered"
                    checked={isDelivered}
                    onChange={() => setIsDelivery(!isDelivered)}
                  />
                  <label htmlFor="isDelivered"> Delivered</label>
                </div>
                <div className="pay-form-group">
                  <input
                    type="radio"
                    id="isPaid"
                    value="isPaid"
                    checked={isPaid}
                    onChange={() => setIsPaid(!isPaid)}
                  />
                  <label htmlFor="isPaid"> Paid</label>
                </div>
                <div className="pay-action-buttons">
                  <button
                    type="submit"
                    className="primary"
                    onClick={handleUpdate}
                  >
                    Update
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderDetails;
