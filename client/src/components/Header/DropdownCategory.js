import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { fetchbrand, maincategory } from "../../API";
import { Link } from "react-router-dom";
const DropdownCategory = () => {
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
//fetch category
  const {
    data: category,
    isLoading: categoryloading,
    isError: categoryerror,
    refetch : refetchdata,
  } = useQuery({
    queryKey: ["category"],
    queryFn: maincategory,
    enabled : true ,
    refetchOnWindowFocus: false,
    retry : 1
  });
 //fetch brand
  const {
    data: brand,
    isLoading: brandloading,
    isError: branderror,
  } = useQuery({
    queryKey: ["brand", selectedCategory],
    queryFn: () => fetchbrand(selectedCategory),
    enabled: !!selectedCategory,
  });


  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };
  const handleButtonClick = () => {
    if(dropdownOpen){
      setSelectedCategory(null);
    }
    else{
      refetchdata()
    }
    toggleDropdown();
    
  };
  const toggleDropdown = () => {
    
    setDropdownOpen(!dropdownOpen);
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
      setSelectedCategory(null);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="all-categories" ref={dropdownRef}>
        <button
          onClick={handleButtonClick }
          className={`dd-button ${dropdownOpen ? "active" : ""}`}
        >
          All Categories
          <img
            src="/images/CaretDown.svg"
            alt="caretdown"
            className={`caret-down ${dropdownOpen ? "rotate" : ""}`}
          />
        </button>
        {dropdownOpen && (
          <ul className="category-list">
            {categoryloading && <p>Loading categories...</p>}
            {categoryerror && <p>Error fetching categories</p>}
            {!categoryloading &&
              !categoryerror &&
              category?.map((category, index) => (
                <li
                  key={index}
                  className="category-item"
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </li>
              ))}
          </ul>
        )}
        {selectedCategory && (
          <div className="sub-dropdown">
            {brandloading && <p>Loading brands...</p>}
            {branderror && <p>Error fetching brands</p>}
            {!brandloading && !branderror && brand && (
              <ul className="brand-list">
                {brand.map((brand, index) => (
                  <Link to={`/search?query=${brand}`} style={{textDecoration : "none"}}>
                  <li key={index} className="brand-item">{brand}
                 </li>
                  </Link>
                  
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownCategory;
