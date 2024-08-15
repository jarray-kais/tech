import React, { useState } from "react";

const CarouselImage = React.memo(({ images }) => {
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };
  return (
    <div className="carousel-container">
      <div className="carousel-main-image">
        <img src={"/"+ images[currentIndex]} alt={` ${currentIndex + 1}`} />
      </div>
      <div className="carousel-thumbnails">
        <button className="carousel-arrow" onClick={prevImage}>
          &lt;
        </button>
        <div className="thumbnails-container">
          {images.map((image, index) => (
            <img
              key={index}
              src={"/"+image}
              alt={` ${index + 1}`}
              className={index === currentIndex ? "active" : ""}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
        <button className="carousel-arrow" onClick={nextImage}>
          &gt;
        </button>
      </div>
    </div>
  );
});

export default CarouselImage;
