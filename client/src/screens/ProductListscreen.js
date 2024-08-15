import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, getProducts, totalProduct } from "../API";
import { useContext, useState } from "react";
import { Store } from "../Context/CartContext";
import Loading from "../components/Loading/Loading";
import Message from "../components/Message/Message";
import { Link } from "react-router-dom";
import Navigationsidebaruser from "../components/NAvigationSideBarUser/Navigationsidebaruser";

const ProductListscreen = () => {
  const [page, setPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [limit, setLimit] = useState(7);
  const { state } = useContext(Store);
  const { userInfo } = state;
  const queryClient = useQueryClient();

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
    enabled: !!userInfo.isSeller || !!userInfo.isAdmin 
  });
  console.log(total)

  const {
    data: All,
    isLoading: alloading,
    error: allerror,
  } = useQuery({
    queryKey: ["allOrder", page, limit],
    queryFn: () => getProducts(page, limit),
    refetchOnWindowFocus: false,
    retry: 1,
    cacheTime: 10000,
    staleTime: 10000 * 60 * 5,
    enabled: !!userInfo.isAdmin,
  });
  console.log(total);
  console.log(All);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      alert("Order deleted successfully");
      if (userInfo?.isAdmin) {
        queryClient.invalidateQueries(["All"]);
      } else {
        queryClient.invalidateQueries(["total"]);
      }
    },
  });

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      deleteMutation.mutate(productId);
    }
  };

  const combineProducts =
    userInfo?.isAdmin || (userInfo?.isAdmin && userInfo?.isSeller)
      ? All?.products
      : total?.products;

  const handleNextPage = () => {
    setPage((old) => old + 1);
  };

  const handlePreviousPage = () => {
    setPage((old) => Math.max(old - 1, 1));
  };

  

  const totalPages =
    userInfo?.isAdmin || (userInfo?.isAdmin && userInfo?.isSeller)
      ? Math.ceil(All?.totalCount / limit)
      : Math.ceil(total?.totalproducts / limit);
    const Pages = Math.ceil(total?.totalCount / limit)
  return (
    <div className="dash">
      <div className="dash-user">
        <Navigationsidebaruser />
      </div>
      <div className="dash-content">
        <div className="dash-title New" >
          <h2>All Products</h2>
          <Link to={`/create`} className="add-to-card-button" >
             Create a new product
            </Link>
        </div>
      
        {totalloading || alloading ? (
          <Loading />
        ) : totalerror || allerror ? (
          <Message variant="danger">{totalerror?.message}{allerror?.message} </Message>
        ) : (
          <>
            <table className="order-table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {combineProducts?.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.brand}</td>
                    <td>
                      {product?.category?.main} {product?.category?.sub}
                    </td>
                    <td>
                      <div>
                        <Link
                          className="action-button view-details"
                          to={`/edit/${product._id}`}
                        >
                          <span style={{ color: "green" }}>Edit ➔</span>
                        </Link>
                        <button
                          className="action-button delete-button"
                          style={{ color: "red" }}
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </button>
                      </div>
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

        {(userInfo?.isAdmin || (userInfo?.isAdmin && userInfo?.isSeller)) ? (
          <>
            <div className="dash-title">
              <h2>Your Products</h2>
            </div>
            {
                totalloading ?(<Loading />) : totalerror ? (<Message variant="danger">{totalerror?.message}</Message>) : (
                    <>
                    <table className="order-table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {total?.products.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.brand}</td>
                    <td>
                      {product?.category?.main} {product?.category?.sub}
                    </td>
                    <td>
                      <div>
                        <Link
                          className="action-button view-details"
                          to={`/edit/${product._id}`}
                        >
                          <span style={{ color: "green" }}>Edit ➔</span>
                        </Link>
                        <button
                          className="action-button delete-button"
                          style={{ color: "red" }}
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </button>
                      </div>
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
              {Array.from({ length: Pages }, (_, index) => index + 1).map(
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
                disabled={page === Pages}
                className={`pagination-button ${
                  page === Pages ? "disabled" : ""
                }`}
              >
                &gt;
              </button>
            </div>
                    </>
                )
            }
          </>
        ): null}
      </div>
    </div>
  );
};

export default ProductListscreen;
