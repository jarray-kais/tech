import { useQuery } from "@tanstack/react-query";
import { getdeal5stars, getdeals } from "../../API";
import "./Best-deal.css";
import Prorductdeal from "./Prorductdeal";
import Loading from "../Loading/Loading";
import Rating from "../featuredProduct/Rating";
import Message from "../Message/Message";
import { useContext, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination,
  Autoplay,
  EffectCoverflow,
  Scrollbar,
  Mousewheel,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-coverflow";
import CarouselImage from "./Carousel";
import { Store } from "../../Context/CartContext";
const Bestdeal = () => {
  const overlay = useRef(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
   // eslint-disable-next-line no-unused-vars
  const [quantity, setQuantity] = useState(1);
  const { dispatch: ctxDispatch } = useContext(Store);

  const handleClickOutside = (event) => {
    if (overlay.current && !overlay.current.contains(event.target)) {
      setShowOverlay(false);
      setShowCarousel(false);
    }
  };

  useEffect(() => {
    if (showOverlay || showCarousel) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOverlay, showCarousel]);
  const {
    data: dealproduct,
    error: Errordeal,
    isLoading: loadingdeal,
  } = useQuery({
    queryKey: ["dealproduct"],
    queryFn: getdeals,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const {
    data: dealfor5stars,
    error: Errordealstar,
    isLoading: loadingdealstar,
  } = useQuery({
    queryKey: ["dealfor5stars"],
    queryFn: getdeal5stars,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        dealfor5stars ? (prevIndex + 1) % dealfor5stars.length : 0
      );
    }, 36000);

    return () => clearInterval(interval);
  }, [dealfor5stars]);

  if (!dealfor5stars || dealfor5stars.length === 0) {
    return <div>No deals available.</div>;
  }

  const currentDeal = dealfor5stars[currentIndex];
  const discount = (
    (1 - currentDeal.promotion.discountedPrice / currentDeal.price) *
    100
  ).toFixed(2);

  const groupProducts = (products, itemsPerGroup) => {
    const groups = [];
    for (let i = 0; i < products?.length; i += itemsPerGroup) {
      groups.push(products.slice(i, i + itemsPerGroup));
    }
    return groups;
  };

  const groupedProducts = groupProducts(dealproduct, 6);
  const imageUrls = currentDeal.image.map((img) => img.url);
const addToCartHandler = () => {
    if (currentDeal.countInStock < quantity) {
      window.alert("Sorry, we don't have enough stock.");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...currentDeal, quantity },
    });
  };


  return (
    <div className="main-deal">
      <div className="deal-text">
        <h3>Best Deals</h3>
      </div>
      <div className="product-deal">
        <div className="product-left">
          {loadingdealstar && <Loading />}
          {Errordealstar && <Message variant="error">{Errordealstar}</Message>}

          <div className="badge">
            <p>{discount} % off </p>
            <span>HOT </span>
          </div>
          <div className="product-left-image">
            <img src={currentDeal.image[0].url} alt="name" />
          </div>
          <div className="product-left-body">
            <div>
              <Rating
                rating={currentDeal.rating}
                numReviews={currentDeal.numReviews}
              />

              <h2>{currentDeal.name}</h2>

              <div className="product-left-price">
                <span className="old-price">{currentDeal.price} TND</span>
                <span className="new-price">
                  {currentDeal.promotion.discountedPrice} TND
                </span>
              </div>

              <p className="description">
              {currentDeal?.description}
              </p>
            </div>
            <div className="product-left-button">
              <button className="add-to-card-button" onClick={addToCartHandler}>ADD TO CARD</button>

              <button
                className="eye-button"
                onClick={() => setShowCarousel(true)}
              >
                {showCarousel && (
                  <div className="overlay">
                    <div className="overlay-content" ref={overlay}>
                      <button
                        className="close-button"
                        onClick={() => setShowCarousel(false)}
                      >
                        Fermer
                      </button>
                      <CarouselImage images={imageUrls} />
                    </div>
                  </div>
                )}
                <i className="fa fa-eye" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
        <Swiper
          className="deal-swipper"
          modules={[
            Pagination,
            Autoplay,
            EffectCoverflow,
            Scrollbar,
            Mousewheel,
          ]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 60000, disableOnInteraction: true }}
          loop={true}
          effect="coverflow"
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          scrollbar={{ draggable: true }}
          mousewheel={true}
        >
          {loadingdeal && <Loading />}
          {Errordeal && <Message variant="error">{Errordeal}</Message>}
          {!loadingdeal &&
            !Errordeal &&
            groupedProducts.map((group, index) => (
              <SwiperSlide key={index}>
                <div className="product-right">
                  {group.map((product) => (
                    <Prorductdeal key={product._id} product={product} />
                  ))}
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Bestdeal;
