import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import CarouselImage from "../components/Best-Deal/Carousel";
import { findproduct, postReview, similarProduct } from "../API";
import Loading from "../components/Loading/Loading";
import Message from "../components/Message/Message";
import Rating from "../components/featuredProduct/Rating";
import { useCallback, useContext, useState } from "react";
import { Store } from "../Context/CartContext";
import Product from "../components/featuredProduct/Product";

const ProductdetailsScreen = () => {
  const { id } = useParams();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [review, setReview] = useState({ comment: "", rating: 0 });

  
  const {
    data: productdetail,
    isLoading: loadingproductdetails,
    error: errorproductdetails,
  } = useQuery({
    queryKey: ["productdetails", id],
    queryFn: () => findproduct(id),
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const {
    data: similarproduct,
    isLoading: similarLoading,
    error: similarError,
  } = useQuery({
    queryKey: ["similar", id],
    queryFn: () => similarProduct(id),
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const mutation = useMutation({
    mutationFn: postReview,
    onSuccess: () => window.alert("Review posted successfully!"),
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      setMessage(errorMessage);
    },
  });


   

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      mutation.mutate({ review, id });
    },
    [review, id, mutation]
  );

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  },[]);
  const handleRating = useCallback((rating) => {
    setReview((prevReview) => ({
      ...prevReview,
      rating,
    }));
  },[]);

  const imageUrls = productdetail?.image?.map((img) => img.url);

  const UpdateCartHandler = useCallback(async (item, newQuantity) => {
    const { data: product } = await findproduct(item._id);
    if (product && product.countInStock < newQuantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    setQuantity(newQuantity);
  }, []);

  const addToCartHandler = useCallback(async () => {
    if (productdetail?.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...productdetail, quantity },
    });
    navigate("/cart");
  }, [productdetail, quantity, ctxDispatch, navigate]);
  

  return (
    <div className="productdetailscreen">
      {loadingproductdetails ? (
        <Loading />
      ) : errorproductdetails ? (
        <Message variant="danger">{errorproductdetails?.message}</Message>
      ) : (
        <>
          <div className="ppp">
            <h2>Product detail</h2>
            <i className="fa fa-angle-right" aria-hidden="true"></i>
          </div>
          <div className="productDetail">
            <div className="caroselimage-productdetail">
              <CarouselImage images={imageUrls} />
            </div>
            <div className="productDetail-right">
              <h2>{productdetail?.name}</h2>
              <div className="row">
          {productdetail.promotion && productdetail.promotion.discountedPrice ? (
            <>
              <div className="old-price ">
                <span className="price-section ">{productdetail.price} TND</span>
              </div>

              <span className="price">
                {productdetail.promotion.discountedPrice} TND
              </span>
            </>
          ) : (
            <span className="price">{productdetail.price} TND</span>
          )}
        </div>
              <Rating
                rating={productdetail?.rating}
                numReviews={productdetail?.numReviews}
              />
              <div>
                {productdetail?.countInStock > 0 ? (
                  <p>
                    Availability:{" "}
                    <span style={{ color: "green" }}>InStock</span>
                  </p>
                ) : (
                  <p>
                    Availability:{" "}
                    <span style={{ color: "red" }}>Out of Stock</span>
                  </p>
                )}
                <p>Brand: {productdetail?.brand}</p>
                <p>Category: {productdetail?.category.main} /{productdetail?.category.sub}</p>
              </div>
              <div className="horizontal-line"></div>
              <div className="description">{productdetail?.description}</div>
              <div className="product-actions">
                <div className="quantity-selector">
                  <button
                   className="quantity-button"
                    onClick={() => UpdateCartHandler(productdetail, quantity - 1)}
                    disabled={quantity === 1}
                  >
                    -
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button
                    className="quantity-button"
                    onClick={() => UpdateCartHandler(productdetail, quantity + 1)}
                    disabled={quantity === productdetail.countInStock}
                  >
                    +
                  </button>
                </div>
                <button className="add-to-cart" onClick={addToCartHandler}>
                  Add to Cart <span>&#9654;</span>
                </button>
                <button className="buy-now">Buy Now</button>
                <div className="safe-checkout">
                  <p>100% Guarantee Safe Checkout</p>
                  <div className="payment-icons">
                    <img src="/images/ApplePay.svg" alt="Apple Pay" />
                    <img src="/images/GooglePay.svg" alt="Google Pay" />
                    <img src="/images/Maestro.svg" alt="Maestro" />
                    <img src="/images/Mastercard.svg" alt="Mastercard" />
                    <img src="/images/Paypal.svg" alt="Paypal" />
                    <img src="/images/Stripestripe.svg" alt="Stripe" />
                    <img src="/images/Visa.svg" alt="Visa" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="Review">
            <div className="body-Review">
              <div className="Description-review">
                <p>Description</p>
                <div className="vertical-line"></div>
                <p>reviews</p>
              </div>
              {productdetail?.reviews?.map((review, index) => (
                <div className="reviews-user" key={review.index}>
                  <div >
                    <img className="avatar" src={"/" + review.profilePicture} alt={review.name} />
                  </div>
                  <div>
                    <p className="name-review">{review.name}</p>
                    <p>{review.comment}</p>
                    <div className="Like">
                      <p>Like</p>
                      <p>Reply</p>
                    </div>
                  </div>
                </div>
              ))}
              { userInfo ? (
                    <form onSubmit={handleSubmit}>
                <div className="review-form">
                  <div className="form-grouppp">
                    <div>
                      <img
                        className="avatar"
                        src={"/" + userInfo.profilePicture}
                        alt={userInfo.name}
                      />
                    </div>
                    <div className="input-container">
                      <label>Your Name:</label>
                      <div className="display-value">{userInfo.name}</div>
                    </div>
                    <div className="input-container">
                      <label>Your Email:</label>
                      <div className="display-value">{userInfo.email}</div>
                    </div>
                  </div>
                  <div className="form-grouppp">
                    <textarea
                    className="textareaa"
                      id="review"
                       name="comment"
                      placeholder="Write your review..."
                      value={review.comment}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div className="form-grouppp">
                    <label>Your Ratings:</label>
                    <div className="ratings">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${review.rating >= star ? 'selected' : ''}`}
                onClick={() => handleRating(star)}
              >
                ★
              </span>
            ))}
          </div>
                  </div>
                  <button className="post-review">
                    Post Review{" "}
                    <i className="fa fa-angle-right" aria-hidden="true"></i>
                    {mutation.isLoading ? <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i> : null}
                  </button>
                </div>
                {message && <p className="error-message">{message}</p>}
              </form>
              ):<p><Link to={"/signin"}>signin</Link> to post Review </p>

              }
              
            </div>
          </div>
          { similarLoading ? (<Loading />) : similarError ?(<Message variant="danger">{similarError.message}</Message>) :(
            <div className="similar">
          <div className="more"> 
          <h1>Similar Product</h1>
          <Link to={`/search?query=${productdetail?.category.main}`}> Show More {'>'} {'>'} </Link>
          </div>
          <div className="related-products">
            {
              similarproduct?.map((product , index)=>(
                <Product key={product.index} product={product}/>
              ))
            }
          </div>
          </div>
          )}
          
        </>
      )}
    </div>
  );
};

export default ProductdetailsScreen;
