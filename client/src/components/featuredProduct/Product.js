import React, { useContext } from "react";
import Rating from "./Rating";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { viewProduct } from "../../API";
import { Store } from "../../Context/CartContext";

const ProductImage = ({ imageUrls, altText }) => {
  const imageUrl = imageUrls && imageUrls[0] ? imageUrls[0].url : null;

  // Vérifie si l'URL commence par "http" ou "https"
  const isAbsoluteUrl =
    imageUrl &&
    (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"));

  return (
    <img
      className="image"
      src={isAbsoluteUrl ? imageUrl : `/${imageUrl}`} // Ajoute un "/" seulement si ce n'est pas une URL absolue
      alt={altText}
    />
  );
};



const Product = React.memo((props) => {

  const { product } = props;

  const navigate = useNavigate();
  const {state} = useContext(Store);
  const { userInfo } = state;

const mutateView = useMutation({
  mutationFn :()=> viewProduct(product._id),
  onSuccess: () =>{
   navigate(`/product/${product._id}`);
  }
})

const handleClick = (e) => {
  if(userInfo){
     e.preventDefault();
  mutateView.mutate(product._id)
  } else{
    navigate(`/product/${product._id}`)
  }
};

  return (
    <div className="card" key={product._id}>
      <Link to={`/product/${product._id}`}  onClick={handleClick}>
        <ProductImage imageUrls={product.image} altText={product.name} />
      </Link>
      <div className="card-body">
        <Rating rating={product.rating} numReviews={product.numReviews} />

        <Link to={`/product/${product._id}`} onClick={handleClick}>
          <h2 id="cardbody">{product.name}</h2>
        </Link>

        <div className="row">
          {product.promotion && product.promotion.discountedPrice ? (
            <>
              <div className="old-price ">
                <span className="price-section ">{product.price} TND</span>
              </div>

              <span className="price">
                {product.promotion.discountedPrice} TND
              </span>
            </>
          ) : (
            <span className="price">{product.price} TND</span>
          )}
        </div>
      </div>
      <div className="seller">
        {product.seller && product.seller.name ? (
          <Link to={`/seller/${product.seller._id}`}>
            {product.seller.name}
          </Link>
        ) : null}
      </div>
    </div>
  );
});

export default Product;
