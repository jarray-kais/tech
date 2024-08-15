import { useState } from 'react';
import { sellerProduct } from '../API';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import Message from '../components/Message/Message';
import Loading from '../components/Loading/Loading';
import Product from '../components/featuredProduct/Product';


const SellerScreen = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  console.log(id)

  const {
    data: seller,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['sellerProduct', page, limit],
    queryFn: () => sellerProduct(id, page, limit),
    refetchOnWindowFocus: false,
    retry: 2,
    cacheTime: 10000,
    staleTime: 10000 * 60 * 5,
  });


  const userInfo = seller?.products[0]?.seller;
 

  const handleNextPage = () => {
    setPage((old) => old + 1);
  };

  const handlePreviousPage = () => {
    setPage((old) => Math.max(old - 1, 1));
  };
 const totalPages = Math.ceil(seller?.totalproducts / limit);

  return (
    <div className="seller-info-container">
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{error?.message}</Message>
      ) : (
        <>
          <div className="banner">
            <img src={`/${userInfo?.seller?.logo}`} alt="Banner" />
          </div>
          <div className="profile-section">
            <img
              className="profile-picture"
              src={`/${userInfo?.profilePicture}`}
              alt="Profile"
            />
            <div className="seller-details">
              <h2>{userInfo?.name}</h2>
              <p>{userInfo?.seller?.description}</p>
            </div>
          </div>
          <div className="contact-info">
            <h3>Contact Seller</h3>
            <p>Numéro du téléphone: +216{userInfo?.telephone}</p>
            <p>Country: {userInfo?.Country}</p>
            <p>Email: {userInfo?.email}</p>
            <div className="social-links">
              <Link to="#"><i className="fab fa-facebook"></i></Link>
              <Link to="#"><i className="fab fa-instagram"></i></Link>
            </div>
          </div>   </>
      )}
          <div className="products">
            {seller?.products?.map((product) => (
              <Product key={product._id} product={product} />
            ))}
            <div className="pagination-container">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className={`pagination-button ${page === 1 ? 'disabled' : ''}`}
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNum) => (
                  <div
                    key={pageNum}
                    className={`pagination-number ${
                      page === pageNum ? 'active' : ''
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
                  page === totalPages ? 'disabled' : ''
                }`}
              >
                &gt;
              </button>
            </div>
          </div>
     
    </div>
  );
};

export default SellerScreen;
