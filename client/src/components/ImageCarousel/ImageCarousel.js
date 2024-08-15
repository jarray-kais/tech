import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './ImageCarousel.css';

const ImageCarousel = () => {
    const images = [
        {
            src: '/images/slider1.jpg',
            alt: 'Slide 1'
        },
        {
            src: '/images/slider2.jpg',
            alt: 'Slide2 '
        },
        {
            src: '/images/slider3.jpg',
            alt: 'Slide3 '
        },
        {
            src: '/images/slider4.jpg',
            alt: 'Slide4 '
        },
        {
            src: '/images/slider5.jpg',
            alt: 'Slide5 '
        },
        {
            src: '/images/slider6.jpg',
            alt: 'Slide6 '
        },
    
    ]
    return (
        <Carousel
            showThumbs={false}
            autoPlay
            infiniteLoop
            showStatus={false}
            dynamicHeight
            useKeyboardArrows
        >
            {images.map((image, index) => (
                <div key={index}>
                    <img src={image.src} alt={image.alt || `Slide ${index}`} />
                </div>
            ))}
        </Carousel>
    );
};

export default ImageCarousel;