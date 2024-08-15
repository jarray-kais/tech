import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { cashPayment } from "../API";
import LoadingOverlay from "../components/Loading/LoadingOverlay";
import Message from "../components/Message/Message";

const CashPayDelevery = () => {
    const { id } = useParams();

  

    const {
        data : order ,
        isLoading ,
        error ,

    }= useQuery({
        queryKey: ["order", id],
        queryFn: () => cashPayment(id),
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 10000 * 60 * 5,
    })
    const formattedDate = order
    ? new Date(order.createdAt).toLocaleDateString("fr-TN", {
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
    {isLoading ? (
        <LoadingOverlay overlay={true} />
      ) : error ? (
        <Message variant="danger">{error.message}</Message>
      ) :
        order ? (
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
                <span>Cash payed</span>
            </p>
          </div>
        
          <Link to={`/detail/${order._id}`} className="button">
            Purchase History
          </Link>
        </div>
        ):null
    }

    </div>
  )
}

export default CashPayDelevery