import { useQuery } from "@tanstack/react-query";
import "./Accessoires.css";
import { accessoires, findproduct } from "../../API";
import Loading from "../Loading/Loading";
import Message from "../Message/Message";
import { useState } from "react";
import Product from "../featuredProduct/Product";
import { Link } from "react-router-dom";

const Accessoires = () => {
  const [subCategory, setSubCategory] = useState("");
  const mainCategory = "Accessoires";
  const id ="66bd44ba0b3126289ede166b"
  

  const { data, isLoading , error } = useQuery({
    queryKey: ["accessoires", mainCategory, subCategory],
    queryFn: () => accessoires(mainCategory, subCategory),
   
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 10000 * 60 * 5,
  });

 const { data : find, isLoading : findLoading, error : findError } = useQuery({
    queryKey: ["find", id],
    queryFn: () => findproduct(id),
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 10000 * 60 * 5,
  })
  console.log(id)
  console.log(accessoires);
  const handleSubCategoryClick = (subCategory) => {
    setSubCategory(subCategory);
  };

  const uniqueSubCategory = [
    ...new Set(data?.map((product) => product.category.sub)),
  ];
  console.log(uniqueSubCategory);
  return (
    <div className="accessoires">
      <div className="accessoires-left">
       { isLoading || findLoading ? ( <Loading />
  ) : (error || findError) ? ( <Message variant="danger">
    {error?.message} {findError?.message}
    </Message>
        ) : (
          <>
            <div className="accessoires-sub">
              <h3>Computer Accessories</h3>
              <ul className="subcategories">
                <li
                  key="all-products"
                  onClick={() => handleSubCategoryClick("")}
                  className={`subcategory-item ${subCategory === "" ? "active" : ""}`}
                >
                  All Product
                </li>
                {uniqueSubCategory?.map((sub) => (
                  <li
                    key={sub}
                    onClick={() => handleSubCategoryClick(sub)}
                    className={`subcategory-item ${subCategory === sub ? "active" : ""}`}
                  >
                    {sub}
                  </li>
                ))}
                   <li 
                  key="Browse"
                  onClick={() => handleSubCategoryClick("")}
                  className={`subcategory-item ${subCategory === "" ? "active" : ""}`}
                ><Link to={`/search?${mainCategory}`} style={{textDecoration : "none"}}>
                  Browse All Product{" "}
                  <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
                
                </Link></li>
              </ul>
            </div>
            <div className="products">
              {subCategory
                ? data?.map((product) => (
                    <Product key={product._id} product={product} />
                  ))
                : data?.map((product) => (
                    <Product key={product._id} product={product} />
                  ))}
            </div>
          </>
        )}
      </div>
      <div className="accessoires-right">
        <div className="accessoires-right-top">
        {find && (
            <div className="Airbus">
              <img src={find.image[0].url} alt={find.name} />
              <h2>{find.name}</h2>
              <p>{find.description}</p>
              <h4>only for: {find.price} TND</h4>
            </div>
          )}
        </div>
        <div className="accessoires-right-bottom"></div>
      </div>
    </div>
  );
};

export default Accessoires;
