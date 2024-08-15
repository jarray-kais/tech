import { useContext, useState } from "react";
import Navigationsidebaruser from "../components/NAvigationSideBarUser/Navigationsidebaruser";
import { Store } from "../Context/CartContext";
import { useQuery } from "@tanstack/react-query";
import { historique, myOrder, Ordercomplete, totalOrder } from "../API";
import Loading from "../components/Loading/Loading";
import Message from "../components/Message/Message";
import { Link, useNavigate } from "react-router-dom";
import Product from "../components/featuredProduct/Product";

const DashboardUser = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [limit, setLimit] = useState(4);
  const navigate = useNavigate();

  const {
    data: total,
    isLoading: totalloading,
    error: totalerror,
  } = useQuery({
    queryKey: ["totalOrder"],
    queryFn: totalOrder,
    refetchOnWindowFocus: false,
    retry: 1,
    cacheTime: 10000,
    staleTime: 10000 * 60 * 5,
  });
  const {
    data: complete,
    isLoading: completeloading,
    error: complteerror,
  } = useQuery({
    queryKey: ["completetOrder"],
    queryFn: Ordercomplete,
    refetchOnWindowFocus: false,
    retry: 1,
    cacheTime: 10000,
    staleTime: 10000 * 60 * 5,
  });

  const {
    data: mine,
    isLoading: minelloading,
    error: mineerror,
  } = useQuery({
    queryKey: ["mineOrder", page, limit],
    queryFn: () => myOrder(page, limit),
    refetchOnWindowFocus: false,
    retry: 1,
    cacheTime: 10000,
    staleTime: 10000 * 60 * 5,
    enabled: !!userInfo && !userInfo.isSeller && !userInfo.isAdmin,
  });
  const {
    data: history,
    isLoading: historyloading,
    error: historyerror,
  } = useQuery({
    queryKey: ["historyOrder", page, limit],
    queryFn: () => historique(page, limit),
    refetchOnWindowFocus: false,
    retry: 1,
    cacheTime: 10000,
    staleTime: 10000 * 60 * 5,
  });
  const handleReorder = (orderId) => {
    // Navigate to a re-order page
    navigate(`/order/${orderId}`);
  };

  return (
    <div className="dash">
      <div className="dash-user">
        <Navigationsidebaruser />
      </div>
      <div className="dash-content">
        <div className="dash-title">
          <h2>Hello, {userInfo?.name} </h2>
          <p>
            From your account dashboard. you can easily check & view your Recent
            Orders, manage your Shipping and Billing Addresses and edit your
            Password and Account Details.
          </p>
        </div>
        <div className="account-container">
          <div className="account-info-container">
            <h2>Account Info</h2>
            <div className="line"></div>

            <div className="accountdetails1">
              <div className="account-details">
                <img
                  src={"/" + userInfo.profilePicture}
                  alt="user"
                  className="account-avatar"
                />
                <div className="account-text">
                  <h3>{userInfo.name}</h3>
                  <p>Country : {userInfo.Country}</p>
                  <p>Email : {userInfo.email}</p>
                  <p>Phone :+216 {userInfo.telephone}</p>
                </div>
              </div>
              <Link
                to={"/profile"}
                className="add-to-card-button edit-button"
                style={{ textDecoration: "none" }}
              >
                Edit Account
              </Link>
            </div>
          </div>
          {totalloading || completeloading ? (
            <Loading />
          ) : totalerror || complteerror ? (
            <Message variant="danger">
              {totalerror?.message} {complteerror?.message}
            </Message>
          ) : (
            <>
              <div className="fun-fact">
                <div className="Fun-Fact1">
                  <img
                    src="/images/IconTotalOrder.svg"
                    alt="icon"
                    className="icon"
                  />
                  <div className="fun-icon">
                    <h3>Total Orders</h3>
                    <p>{total?.totalOrders ? total?.totalOrders : 0}</p>
                  </div>
                </div>
                <div className="Fun-Fact2">
                  <img
                    src="/images/IconOrder.svg"
                    alt="icon"
                    className="icon"
                  />
                  <div className="fun-icon">
                    <h3>Completed Orders</h3>
                    <p>{complete ? complete : 0}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="dash-order">
          <div className="recent">
            <h2>Recent Orders</h2>
            <p>
              <Link to="/orderhistory" style={{ textDecoration: "none" }}>
                <strong>view All</strong>
                <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
              </Link>
            </p>
          </div>
          {minelloading ? (
            <Loading />
          ) : mineerror ? (
            <Message variant="danger">{mineerror.message}</Message>
          ) : (
            <table className="order-table">
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {mine?.orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td
                      className={`status ${
                        order.isCanceled
                          ? "canceled"
                          : order.isDelivered
                          ? "completed"
                          : "in-progress"
                      }`}
                    >
                      {order.isCanceled
                        ? "canceled"
                        : order.isDelivered
                        ? "completed"
                        : "in-progress"}
                    </td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>
                      ${order.totalPrice} ({order.orderItems.length} Products)
                    </td>
                    <td>
                      {order.Canceled ? (
                         <Link
                          className="action-button re-order"
                          onClick={handleReorder(order._id)}
                        >
                          Re-order ➔
                        </Link> ) : 
                        order.isDelivered ? (
                          <Link
                            to={`/detail/${order._id}`}
                            className="action-button view-details"
                          >
                            View Details ➔
                          </Link>
                        ) : (
                          <Link
                            to={`/detail/${order._id}`}
                            className="action-button view-details-progress"
                          >
                            View Details ➔
                          </Link>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="dash-history">
          <div className="recent">
            <h2>Browsing history</h2>
            <p>
              <Link to="/history" style={{ textDecoration: "none" }}>
                <strong>view All</strong>
                <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
              </Link>
            </p>
          </div>
          {historyloading ? (
            <Loading />
          ) : historyerror ? (
            <Message variant="danger">{historyerror.message}</Message>
          ) : (
            <div className="history-product">
              {history?.history.map((product, index) => (
                <Product key={index} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;
