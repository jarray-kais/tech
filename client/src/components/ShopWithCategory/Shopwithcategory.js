import { useQuery } from '@tanstack/react-query'
import { shop } from '../../API'
import Loading from '../Loading/Loading'
import Message from '../Message/Message'
import Category from './Category'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from "swiper/react"
import "./Shopwithcategory.css"

const Shopwithcategory = () => {

    const {
        data ,
        isLoading ,
        error
    }= useQuery({
        queryKey : ['shop'],
        queryFn : shop,
        refetchOnWindowFocus : false,
        retry : 0,

    })

  return (
    <div className='category'>
    { isLoading ? (<Loading />) : error ? (<Message variant='danger'>{error}</Message>) : (
        <>
        <div className="featured-title" >
        <h3 >Shop with Categorys</h3>
      </div>
      <Swiper className='category-swiper' 
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={10}
        slidesPerView={6}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: true  }}
      >
        {data.map((product) => (
          <SwiperSlide key={product._id} >
            <Category  product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
      </>
      )}
    </div>
  )
}

export default Shopwithcategory