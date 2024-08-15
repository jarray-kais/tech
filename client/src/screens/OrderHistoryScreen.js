import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { myOrder, sellerOrder, orders, deleteOrder } from "../API";
import { Store } from "../Context/CartContext";
import Navigationsidebaruser from "../components/NAvigationSideBarUser/Navigationsidebaruser";
import { Link } from "react-router-dom";
import Message from "../components/Message/Message";
import Loading from "../components/Loading/Loading";

const OrderHistoryScreen = () => {
  const [page, setPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [limit, setLimit] = useState(6);
  const { state } = useContext(Store);
  const { userInfo } = state;
  const queryClient = useQueryClient();
  const {
    data: mine,
    isLoading: minelloading,
    error: mineerror,
  } = useQuery({
    queryKey: ["mineOrder", page, limit],
    queryFn: () => myOrder(page, limit),
    refetchOnWindowFocus: false,
    retry: 7,
    cacheTime: 10000,
    staleTime: 10000 * 60 * 5,
    enabled: !!userInfo && !userInfo.isSeller && !userInfo.isAdmin,
  });
  console.log(mine);
  const {
    data: orderSeller,
    isLoading: orderLoading,
    error: orderError,
  } = useQuery({
    queryKey: ["seller", page, limit],
    queryFn: () => sellerOrder(page, limit),
    refetchOnWindowFocus: false,
    retry: 1,
    cacheTime: 10000,
    staleTime: 10000 * 60 * 5,
    enabled: !!userInfo.isSeller,
  });
  console.log(orderSeller);

  const {
    data: AllOrder,
    isLoading: AllOrderLoading,
    error: AllOrderError,
  } = useQuery({
    queryKey: ["All", page, limit],
    queryFn: () => orders(page, limit),
    refetchOnWindowFocus: false,
    retry: 1,
    cacheTime: 10000,
    staleTime: 10000 * 60 * 5,
    enabled: !!userInfo.isAdmin,
  });

  const combinedOrders = userInfo?.isSeller
    ? orderSeller?.orders
    : userInfo?.isAdmin || (userInfo?.isAdmin && userInfo?.isSeller)
    ? AllOrder?.orders
    : mine?.orders;

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate) ? "-" : parsedDate.toLocaleString();
  };

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      alert("Order deleted successfully");
      if (!userInfo) return;
      if (!userInfo.isSeller && !userInfo.isAdmin) {
        queryClient.invalidateQueries(["mine"]);
      }
      if (userInfo.isSeller) {
        queryClient.invalidateQueries(["sellerOrder"]);
      }
      if (userInfo.isAdmin) {
        queryClient.invalidateQueries(["allOrder"]);
      }
    },
  });
  const handleDelete = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      console.log(orderId);
      deleteMutation.mutate(orderId);
    }
  };

  const handleNextPage = () => {
    setPage((old) => old + 1);
  };

  const handlePreviousPage = () => {
    setPage((old) => Math.max(old - 1, 1));
  };

  console.log(combinedOrders);

  const totalPages =
    userInfo?.isAdmin || (userInfo?.isAdmin && userInfo?.isSeller)
      ? Math.ceil(AllOrder?.totalCount / limit)
      : userInfo.isSeller
      ? Math.ceil(orderSeller?.totalOrdersResult[0]?.totalOrders / limit)
      : Math.ceil(mine?.totalCount / limit);

  return (
    <div className="dash">
      <div className="dash-user">
        <Navigationsidebaruser />
      </div>

      <div className="dash-content">
        <h1>Order HIstory</h1>
        {minelloading || orderLoading || AllOrderLoading ? (
          <Loading />
        ) : mineerror || AllOrderError || orderError ? (
          <Message variant="danger">
            {mineerror?.message}
            {AllOrderError?.message}
            {orderError?.message}
          </Message>
        ) : (
          <>
            <table className="order-table">
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>STATUS</th>
                  <th>DATE Placed</th>
                  <th>DATE Payment</th>
                  <th>TOTAL</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {combinedOrders?.map((order) => (
                  <tr key={order._id}>
                    <td>{userInfo.isSeller ? order.order._id : order._id}</td>
                    <td
                      className={`status ${
                        order.isCanceled
                          ? "canceled"
                          :  (
                              userInfo.isSeller
                                ? order.order.isDelivered
                                : order.isDelivered
                            )
                            ? "completed"
                            : "in-progress"
                         
                      }`}
                    >
                      {order.isCanceled
                        ? "CANCELED"
                        :  (
                            userInfo.isSeller
                              ? order.order.isDelivered
                              : order.isDelivered
                          )
                          ? "COMPLETED"
                          : "IN PROGRESS"
                       }
                    </td>
                    <td>
                      {formatDate(
                        userInfo.isSeller
                          ? order.order.createdAt
                          : order.createdAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      {formatDate(
                        userInfo.isSeller ? order.order.paidAt : order.paidAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      $
                      {userInfo.isSeller
                        ? order.order.totalPrice
                        : order.totalPrice}{" "}
                      (
                      {userInfo.isSeller
                        ? order.itemsCount
                        : order.orderItems.length}{" "}
                      Products)
                    </td>
                    <td>
                      {userInfo.isSeller || userInfo.isAdmin ? (
                        <div>
                          <Link
                            className="action-button view-details"
                            to={
                              userInfo.isSeller
                                ? `/detail/${order.order._id}`
                                : `/detail/${order._id}`
                            }
                          >
                            <span style={{ color: "green" }}>
                              View Details ➔
                            </span>
                          </Link>
                          <button
                            className="action-button delete-button"
                            style={{ color: "red" }}
                            onClick={() =>
                              handleDelete(
                                userInfo.isSeller ? order.order._id : order._id
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      ) : order.isCanceled ? (
                        <span className="action-button re-order">
                          Re-order ➔
                        </span>
                      ) :  (
                        
                          userInfo.isSeller
                            ? order.order.isDelivered
                            : order.isDelivered
                        ) ? (
                          <Link
                            className="action-button view-details"
                            to={
                              userInfo.isSeller
                                ? `/detail/${order.order._id}`
                                : `/detail/${order._id}`
                            }
                          >
                            View Details ➔
                          </Link>
                        ) : (
                          <Link
                            className="action-button view-details-progress"
                            to={
                              userInfo.isSeller
                                ? `/detail/${order.order._id}`
                                : `/detail/${order._id}`
                            }
                          >
                            View Details ➔
                          </Link>
                        
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination-container">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className={`pagination-button ${page === 1 ? "disabled" : ""}`}
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNum) => (
                  <div
                    key={pageNum}
                    className={`pagination-number ${
                      page === pageNum ? "active" : ""
                    }`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </div>
                )
              )}
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className={`pagination-button ${
                  page === totalPages ? "disabled" : ""
                }`}
              >
                &gt;
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryScreen;
