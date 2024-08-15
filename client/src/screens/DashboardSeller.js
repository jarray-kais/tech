import { useQuery } from "@tanstack/react-query";
import { historique, sellerinfo, sellerOrder, totalProduct } from "../API";
import Rating from "../components/featuredProduct/Rating";
import Loading from "../components/Loading/Loading";
import Message from "../components/Message/Message";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import Product from "../components/featuredProduct/Product";
import Navigationsidebaruser from "../components/NAvigationSideBarUser/Navigationsidebaruser";
import { Store } from "../Context/CartContext";

const DashboardSeller = () => {
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [limit, setLimit] = useState(4);
  const { state } = useContext(Store);
  const { userInfo } = state;
  const {
    data: infoSeller,
    // eslint-disable-next-line no-unused-vars
    isLoading: loadingSeller,
    // eslint-disable-next-line no-unused-vars
    error: errorSeller,
  } = useQuery({
    queryKey: ["sellerInfo"],
    queryFn: sellerinfo,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!userInfo.isSeller,
  });

  const {
    data: total,
    isLoading: totalloading,
    error: totalerror,
  } = useQuery({
    queryKey: ["totalOrder", page, limit],
    queryFn: () => totalProduct(page, limit),
    refetchOnWindowFocus: false,
    retry: 1,
    cacheTime: 10000,
    staleTime: 10000 * 60 * 5,
    enabled: !!userInfo.isSeller,
  });

  const {
    data: orderSeller,
    isLoading: orderLoading,
    error: orderError,
  } = useQuery({
    queryKey: ["seller"],
    queryFn: sellerOrder,
    refetchOnWindowFocus: false,
    retry: 1,
    cacheTime: 10000,
    staleTime: 10000 * 60 * 5,
    enabled: !!userInfo.isSeller,
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
    enabled: !!userInfo.isSeller,
  });

  return (
    <div className="dash">
      <div className="dash-user">
        <Navigationsidebaruser />
      </div>
      <div className="dash-content">
        <div className="dash-title">
          <h2>Hello, {infoSeller?.name} </h2>
          <Rating
            rating={infoSeller?.seller?.rating}
            numReviews={infoSeller?.seller?.numReviews}
          />
        </div>

        <div className="account-container">
          <div className="account-info-container">
            <h2>Account Info</h2>
            <div className="line"></div>
            <div className="accountdetails1">
              <div className="account-details">
                <img
                  src={"/" + infoSeller?.profilePicture}
                  alt="user"
                  className="account-avatar"
                />
                <div className="account-text">
                  <h3>{infoSeller?.name}</h3>
                  <p>Country : {infoSeller?.Country}</p>
                  <p>Email : {infoSeller?.email}</p>
                  <p>Phone :+216 {infoSeller?.telephone}</p>
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
          <div className="account-info-container">
            <h2>Billing address</h2>
            <div className="line"></div>
            <div className="accountdetails1">
              <div className="account-details">
                <div className="account-text">
                  <h3>{infoSeller?.name}</h3>
                  <p>Country : {infoSeller?.Country}</p>
                  <p>Address : {infoSeller?.seller?.Address}</p>
                </div>
              </div>
              <button className="add-to-card-button edit-button">
                Edit address
              </button>
            </div>
          </div>
          <div style={{ width: "30%" }}>
            {totalloading ? (
              <Loading />
            ) : totalerror ? (
              <Message variant="danger">{totalerror?.message}</Message>
            ) : (
              <>
                <div className="Fun-Fact1">
                  <img
                    src="/images/IconTotalOrder.svg"
                    alt="icon"
                    className="icon"
                  />
                  <div className="fun-icon">
                    <h3>Total products</h3>
                    <p>{total?.totalproducts}</p>
                  </div>
                </div>
              </>
            )}
            {orderLoading ? (
              <Loading />
            ) : orderError ? (
              <Message variant="danger">{orderError?.message}</Message>
            ) : (
              <>
                <div className="Fun-Fact3">
                  <img
                    src="/images/IconOrder.svg"
                    alt="icon"
                    className="icon"
                  />
                  <div className="fun-icon">
                    <h3> Orders</h3>

                    <p>
                      {orderSeller?.totalOrdersResult[0]
                        ? orderSeller?.totalOrdersResult[0]?.totalOrders
                        : 0}
                    </p>
                  </div>
                </div>
                <div className="Fun-Fact2">
                  <img src="/images/Icon.svg" alt="icon" className="icon" />
                  <div className="fun-icon">
                    <h3>Completed Orders</h3>
                    <p>
                      {orderSeller?.totalDeliveredOrdersResult[0]
                        ? orderSeller?.totalDeliveredOrdersResult[0]
                            ?.totalDeliveredOrders
                        : 0}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="recent">
          <h2>List Orders</h2>
          <p>
            <Link to="/orderhistory" style={{ textDecoration: "none" }}>
              <strong>view All</strong>
              <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
            </Link>
          </p>
        </div>
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
            {orderSeller?.orders.map((order) => (
              <tr key={order._id}>
                <td>{order?.order._id}</td>
                <td
                  className={`status ${
                    order.order.isCanceled
                      ? "canceled"
                      : order.order.isDelivered
                      ? "completed"
                      : "in-progress"
                  }`}
                >
                  {order.order.isCanceled
                    ? "canceled"
                    : order.order.isDelivered
                    ? "completed"
                    : "in-progress"}
                </td>
                <td>{new Date(order.order?.paidAt).toLocaleString()}</td>
                <td>
                  ${order.order.totalPrice} ({order.order.itemsCount} Products)
                </td>
                <td>
                  {
                    order.order.isDelivered ? (
                      <Link
                        to={`/detail/${order?.order._id}`}
                        className="action-button view-details"
                      >
                        View Details ➔
                      </Link>
                    ) : (
                      <Link
                        to={`/detail/${order?.order._id}`}
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
  );
};

export default DashboardSeller;
