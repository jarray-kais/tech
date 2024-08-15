import { useState } from 'react';
import Navigationsidebaruser from '../components/NAvigationSideBarUser/Navigationsidebaruser';
import { useQuery } from '@tanstack/react-query';
import { historique } from '../API';
import Loading from '../components/Loading/Loading';
import Message from '../components/Message/Message';
import Product from '../components/featuredProduct/Product';

const BrowsingHistory = () => {
  const [page , setPage]=useState(1)
  // eslint-disable-next-line no-unused-vars
  const [limit, setLimit]=useState(16)

  const {
    data : history,
    isLoading : loading,
    error : errorr,
  } = useQuery({
    queryKey: ['historique',page , limit] ,
    queryFn : ()=>historique(page , limit),
    refetchOnWindowFocus: false,
    retry: 0,
    cacheTime: 10000,
    staleTime: 10000 * 60 * 5,
  })
  const handleNextPage = () => {
    setPage((old) => old + 1);
  };

  const handlePreviousPage = () => {
    setPage((old) => Math.max(old - 1, 1));
  };

  const totalPages = Math.ceil(history?.totalcount / limit)
  return (
    <div className="dash">
      <div className="dash-user">
        <Navigationsidebaruser />
      </div>
      <div className="dash-content">
      <div className="dash-title">
        <h2>Historique des visites</h2>
      </div>
      {
        loading ? (<Loading />) : errorr ? (<Message variant="danger">{errorr?.message}</Message>):(
          <>
          <div className="searchproduct">
               {history?.history.length > 0 ? (
              history?.history.map((product, index) => (
                <Product key={index} product={product} />
              ))
            ) : (
              <Message >No browsing history found.</Message>
            )}
          </div>
          <div className="pagination-container">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className={`pagination-button ${page === 1 ? "disabled" : ""}`}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
            <div
              key={pageNum}
              className={`pagination-number ${page === pageNum ? "active" : ""}`}
              onClick={() => setPage(pageNum)}
            >
              {pageNum}
            </div>
          ))}
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className={`pagination-button ${page === totalPages ? "disabled" : ""}`}
          >
            &gt;
          </button>
        </div>
          </>
        )
      }
      </div>
      </div>
  )
}

export default BrowsingHistory