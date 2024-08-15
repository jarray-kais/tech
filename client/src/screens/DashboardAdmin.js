import { useContext, useState } from "react";
import { Store } from "../Context/CartContext";
import Navigationsidebaruser from "../components/NAvigationSideBarUser/Navigationsidebaruser";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchsummary, orders } from "../API";
import Loading from "../components/Loading/Loading";
import Message from "../components/Message/Message";
import Chart from "react-google-charts";

const DashboardAdmin = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
// eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [limit, setLimit] = useState(0);

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
  const {
    data: summary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["summary"],
    queryFn: fetchsummary,
    refetchOnWindowFocus: false,
    retry: 1,
    cacheTime: 10000,
    staleTime: 10000 * 60 * 5,
    enabled: !!userInfo.isAdmin,
  });
  console.log(summary);

  return (
    <div className="dash">
      <div className="dash-user">
        <Navigationsidebaruser />
      </div>
      <div className="dash-content">
        <div className="dash-title">
          <h2>Hello, {userInfo?.name} </h2>
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
          <div style={{ width: "30%" }}>
            {AllOrderLoading ? (
              <Loading />
            ) : AllOrderError ? (
              <Message variant="danger">{AllOrderError?.message}</Message>
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
                    <p>{AllOrder?.totalCount}</p>
                  </div>
                </div>

                <div className="Fun-Fact3">
                  <img
                    src="/images/IconOrder.svg"
                    alt="icon"
                    className="icon"
                  />
                  <div className="fun-icon">
                    <h3>canceled Orders</h3>
                    <p>{AllOrder?.canceledOrder}</p>
                  </div>
                </div>
                <div className="Fun-Fact2">
                  <img src="/images/Icon.svg" alt="icon" className="icon" />
                  <div className="fun-icon">
                    <h3>Completed Orders</h3>
                    <p>{AllOrder?.completeOrder}</p>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="funn-fact4">
            <div className="visit">
              <h3>Visitors</h3>
              <p>{localStorage.getItem("visitCount")}</p>
            </div>
            <div>
              <img src="/images/chart.svg" alt="chart" />
            </div>
          </div>
        </div>
        {summaryLoading ? (
          <Loading />
        ) : summaryError ? (
          <Message variant="danger">{summaryError?.messsage}</Message>
        ) : (
          <>
            <ul className="row summary">
              <li>
                <div className="summary-title color1">
                  <span>
                    <i className="fa fa-users" /> Users
                  </span>
                </div>
                <div className="summary-body">{summary?.users[0].numUsers}</div>
              </li>
              <li>
                <div className="summary-title color2">
                  <span>
                    <i className="fa fa-shopping-cart" /> Orders
                  </span>
                </div>
                <div className="summary-body">
                  {summary?.orders[0] ? summary?.orders[0].numOrders : 0}
                </div>
              </li>
              <li>
                <div className="summary-title color3">
                  <span>
                    <i className="fa fa-money" /> Sales
                  </span>
                </div>
                <div className="summary-body">
                  $
                  {summary?.orders[0]
                    ? summary?.orders[0].totalSales.toFixed(2)
                    : 0}
                </div>
              </li>
            </ul>

            <div>
              <h2>Sales</h2>
              {summary?.dailyOrders.length === 0 ? (
                <Message>No Sale</Message>
              ) : (
                <Chart
                  width="100%"
                  height="200px"
                  chartType="ColumnChart"
                  loader={<div>Loading Chart</div>}
                  data={[
                    ["Date", "Sales"],
                    ...summary?.dailyOrders?.map((x) => [x._id, x.sales]),
                  ]}
                ></Chart>
              )}
              {summary?.usersByMonth.length === 0 ? (
                <Message>No user</Message>
              ) : (
                <Chart
                  width="100%"
                  height="400px"
                  chartType="LineChart"
                  loader={<div>Loading Chart</div>}
                  data={[
                    ["Month", "Users"],
                    ...summary.usersByMonth.map((x) => [x._id, x.count]),
                  ]}
                />
              )}
            </div>
            <div>
              <h2>Categories</h2>
              {summary.productCategories.length === 0 ? (
                <Message>No Category</Message>
              ) : (
                <Chart
                  width="100%"
                  height="400px"
                  chartType="PieChart"
                  loader={<div>Loading Chart</div>}
                  data={[
                    ["Category", "Products"],
                    ...summary.productCategories.map((x) => [x._id, x.count]),
                  ]}
                />
              )}
            </div>
            <div>
              <h2>PaymentMethod</h2>
              {summary?.salesByPaymentMethod.length === 0 ? (
                <Message>No PaymentMethod</Message>
              ) : (
                <Chart
                  width="100%"
                  height="400px"
                  chartType="PieChart"
                  loader={<div>Loading Chart</div>}
                  data={[
                    ["Payment Method", "Total Sales"],
                    ...summary?.salesByPaymentMethod.map((x) => [
                      x._id,
                      x.totalSales,
                    ]),
                  ]}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardAdmin;
