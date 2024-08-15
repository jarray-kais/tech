import { useState, useMemo } from 'react';
import ReactSlider from 'react-slider';
import _ from 'lodash';
import './PriceSlider.css';

const PriceSlider = ({ minPrice, maxPrice, onPriceChange }) => {
  const [value, setValue] = useState([minPrice || 0, maxPrice || 100]);

  const debouncedOnPriceChange = useMemo(
    () => _.debounce(onPriceChange, 500),
    [onPriceChange]
  );

  const handleChange = (newValue) => {
    setValue(newValue);
    debouncedOnPriceChange(newValue);
  };

  return (
    <div className="price-slider">
      <h2>Price Range</h2>
      <div className="slider-container">
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="thumb"
          trackClassName="track"
          defaultValue={[0, 100]}
          min={0}
          max={10000}
          value={value}
          onChange={handleChange}
         
        />
      </div>
      <div className="price-values">
        <span>TND{value[0]}</span>
        <span>TND{value[1]}</span>
      </div>
    </div>
  );
};

export default PriceSlider;
