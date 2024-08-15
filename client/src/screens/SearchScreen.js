import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { maincategory, fetchbrand, search } from "../API";
import Loading from "../components/Loading/Loading";
import Message from "../components/Message/Message";
import queryString from "query-string";
import { useEffect, useState } from "react";
import Product from "../components/featuredProduct/Product";
import PriceSlider from "../components/SliderPrice/PriceSlider";

const SearchScreen = () => {
  const query = useLocation().search;
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
   // eslint-disable-next-line no-unused-vars
  const [limit, setLimit] = useState(16);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
   // eslint-disable-next-line no-unused-vars
  const [initialQuery, setInitialQuery] = useState("");

  useEffect(() => {
    const params = queryString.parse(query);
    if (params.initialQuery) {
      setInitialQuery(params.initialQuery);
    }

    if (params.category) {
      setSelectedCategory(decodeURIComponent(params.category).split(","));
    }
    if (params.brand) {
      setSelectedBrands(params.brand.split(","));
    }
    if (params.minPrice) {
      setMinPrice(params.minPrice);
    }
    if (params.maxPrice) {
      setMaxPrice(params.maxPrice);
    }
  }, [query]);
  const {
    data: searchResult,
    isLoading: searchLoading,
    isError: searchError,
  } = useQuery({
    queryKey: ["search", query, page, limit],
    queryFn: () => search(query, page, limit),
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 3000,
    keepPreviousData: true,
  });


  const {
    data: categories,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useQuery({
    queryKey: ["category"],
    queryFn: maincategory,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const {
    data: allBrands,
    isLoading: brandLoading,
    isError: brandError,
    refetch,
  } = useQuery({
    queryKey: ["Allbrand"],
    queryFn: () => fetchbrand(""),
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 30000,
  });

  const handleNextPage = () => {
    setPage((old) => old + 1);
  };

  const handlePreviousPage = () => {
    setPage((old) => Math.max(old - 1, 1));
  };

  const handleCategoryChange = (category) => {
    let updatedCategories = [];
    if (selectedCategory.includes(category)) {
      updatedCategories = selectedCategory.filter(
        (selectedCategory) => selectedCategory !== category
      );
      console.log(updatedCategories);
      console.log(selectedCategory.includes(category));
    } else {
      updatedCategories = [...selectedCategory, category];
      console.log(updatedCategories);
    }

    setSelectedCategory(updatedCategories);
    updateQueryParams({
      category: encodeURIComponent(updatedCategories.join(",")),
    });
  };

  const handleBrandChange = (brand) => {
    let updatedBrands = [];
    if (selectedBrands.includes(brand)) {
      updatedBrands = selectedBrands.filter(
        (selectedBrand) => selectedBrand !== brand
      );
    } else {
      updatedBrands = [...selectedBrands, brand];
    }

    setSelectedBrands(updatedBrands);
    updateQueryParams({ brand: updatedBrands.join(",") });
  };

  const updateQueryParams = (newParams) => {
    const currentParams = queryString.parse(query); // Assume 'query' comes from 'useLocation'
    const updatedParams = { ...currentParams, ...newParams };

    // Order the parameters
    const orderedParams = {
      query: updatedParams.query || "",
      category: updatedParams.category || "",
      brand: updatedParams.brand || "",
      minPrice: updatedParams.minPrice || "",
      maxPrice: updatedParams.maxPrice || "",
    };
   
    // Remove empty parameters
    const filteredParams = Object.fromEntries(
      Object.entries(orderedParams).filter(([key, value]) => value !== "")
    );
    console.log(filteredParams);
    console.log(queryString.stringify(filteredParams));
    
    let queryStr = "";
    if (filteredParams.query) queryStr += `query=${filteredParams.query}&`;
    if (filteredParams.category)
      queryStr += `category=${filteredParams.category}&`;
    if (filteredParams.brand) queryStr += `brand=${filteredParams.brand}&`;
    if (filteredParams.minPrice)
      queryStr += `minPrice=${filteredParams.minPrice}&`;
    if (filteredParams.maxPrice)
      queryStr += `maxPrice=${filteredParams.maxPrice}&`;

    // Remove trailing '&'
    if (queryStr.endsWith("&")) queryStr = queryStr.slice(0, -1);
    console.log(queryStr);

    // Construct the final URL
    navigate({
      pathname: "/search",
      search: queryStr,
    });
  };
  const handleChangePrice = (newPrices) => {
    setMinPrice(newPrices[0]);
    setMaxPrice(newPrices[1]);
    updateQueryParams({ minPrice, maxPrice });
    refetch();
  };

  console.log(searchResult)
  const Pages = Math.ceil(searchResult?.totalResults / limit)
  

  return (
    <div className="search">
      {categoryLoading || brandLoading ? (
        <Loading />
      ) : categoryError || brandError ? (
        <Message variant="danger">
          {categoryError?.message}
          {brandError?.message}
        </Message>
      ) : (
        <>
          <div className="list-c">
            <div className="search-category">
              <h2>Category</h2>
              <div className="search-form-group">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className={`search-category-group ${
                      selectedCategory.includes(category) ? "active" : ""
                    }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    <input
                      type="radio"
                      value={category}
                      checked={selectedCategory.includes(category)}
                      readOnly
                    />
                    <label htmlFor="category">{category}</label>
                  </div>
                ))}
              </div>
            </div>
            <PriceSlider
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={handleChangePrice}
            />

            <div className="brand-filter">
              <h2>Popular Brands</h2>
              <div className="brandlist">
                {allBrands.map((brand, index) => (
                  <div
                    key={index}
                    className={`brand-group ${
                      selectedBrands.includes(brand) ? "active" : ""
                    }`}
                    onClick={() => handleBrandChange(brand)}
                  >
                    <input
                      id="brand"
                      type="checkbox"
                      value={brand}
                      checked={selectedBrands.includes(brand)}
                      readOnly
                    />
                    <label htmlFor={`brand-${index}`}>{brand}</label>
                  </div>
                ))}
              </div>
            </div>
            <img
              src="/images/Banner.svg"
              alt="banner"
              style={{ width: "70%", marginLeft: "40px" }}
            />
          </div>
          <div className="productList">
            {searchLoading ? (
              <Loading />
            ) : searchError ? (
              <Message variant="danger">{searchError.message}</Message>
            ) : (
              <>
                <div className="searchproduct">
                  {searchResult?.results?.length > 0 ? (
                    searchResult.results.map((result, index) => (
                      
                        result.fullDocument && (
                        <Product
                          key={result.fullDocument._id}
                          product={result.fullDocument}
                        />
                        )
                      
                    ))
                  ) : (
                    <p>
                      Try adjusting your search or filter to find what you are
                      looking for.
                    </p>
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
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchScreen;
