import { useContext, useEffect, useState } from 'react';
import BackButton from '../components/BackButton/BackButton';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Context/CartContext';
import CheckoutSteps from '../components/Chekout/CheckoutSteps';

const ShippingAddressScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    fullBox,
    userInfo,
    cart: { shippingAddress },
  } = state;
  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');
    
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);
  

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
        location: shippingAddress.location,
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
        location: shippingAddress.location,
      })
    );
    navigate('/payment');
  };

  useEffect(() => {
    ctxDispatch({ type: 'SET_FULLBOX_OFF' });
  }, [ctxDispatch, fullBox]);


  return (
    <div className="shipping-container">
    <CheckoutSteps step1 step2 step3={false} />
    
    <div className='shipping-body'>
    <BackButton />
      <h1 className="shipping-title">Shipping Address</h1>
      <p className="shipping-description">Please enter your shipping details.</p>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label className="form-label">Information</label>
          <input
            type="text"
            className="form-control"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <button
            className="form-control"
            type="button"
            variant="light"
            value={address}
            onClick={() => navigate('/map')}
            required >
             Choose Location On Map
          </button>
           {shippingAddress.location && shippingAddress.location.lat ? (
              <div>
                LAT: {shippingAddress.location.lat}
                LNG:{shippingAddress.location.lng}
              </div>
            ) : (
              <div>No location</div>
            )}
        </div>
        <div className="form-group">
          
          <input
            type="text"
            className="form-control"
            placeholder="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <input
            type="text"
            className="form-control"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <input
            type="text"
            className="form-control"
            placeholder="Your country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
          <input
            type="text"
            className="form-control"
            placeholder="Your postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="continue-btn">continue</button>
      </form>
      </div>
    </div>
  );
};

export default ShippingAddressScreen;
