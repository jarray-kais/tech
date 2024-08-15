import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "./FeaturedProducts.css";
import { useQuery } from "@tanstack/react-query";
import { featuredproduct } from "../../API";
import Product from "./Product";
import Loading from "../Loading/Loading";

const FeaturedProducts = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["featured"],
    queryFn: featuredproduct,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 100000,
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="featured" >
      <div className="featured-title" >
        <h3>Featured Products</h3>
      </div>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={6}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: true  }}
      >
        {data.map((product) => (
          <SwiperSlide key={product._id}>
            <Product  product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturedProducts;
