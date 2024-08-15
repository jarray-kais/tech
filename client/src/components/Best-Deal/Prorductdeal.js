import { useMutation } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { viewProduct } from "../../API";
import { Store } from "../../Context/CartContext";

const Prorductdeal = (props) => {
  const { product } = props;
  const navigate = useNavigate();
  const {state} = useContext(Store);
  const { userInfo } = state;
  const [timeremaining , setTimeremaing]= useState('')
  const discount = ((1 - product.promotion.discountedPrice / product.price) * 100).toFixed(2);

  useEffect(()=>{
    const endDate = new Date(product.promotion.endDate)
    const updateCountdown = ()=>{
      const remainingtime = endDate - new Date();
      if(remainingtime > 0) {
        const days = Math.floor(remainingtime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingtime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingtime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingtime % (1000 * 60)) / 1000);
        setTimeremaing(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
      else{
        setTimeremaing('Deal Ended');
      }
    }
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  },[product.promotion.endDate])

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
    <div className="cardd" key={product._id}>
    <div className="Daeal" id="deal">
        <span className="discount">{discount}% off</span>
        <span className="time">{timeremaining}</span>
    </div>
      <Link to={`/product/${product._id}`} onClick={handleClick}>
        <img className="img" src={product.image[0].url} alt={product.name} />
      </Link>
      <div className="cardbody">
        <Link to={`/product/${product._id}`} onClick={handleClick}>
          <h2 id="cardbody">{product.name}</h2>
        </Link>
        <div className="row">
          <div className="price-section">
          <span className="old-price">{product.price} TND </span>
          
             {product.promotion.discountedPrice ? (
              <span className="price">{product.promotion.discountedPrice} TND</span>
            ) : null}
           

            
           
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Prorductdeal;
