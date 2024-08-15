
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Context/CartContext';
import CheckoutSteps from '../components/Chekout/CheckoutSteps';
import BackButton from '../components/BackButton/BackButton';


const PaymentMethodScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    // eslint-disable-next-line no-unused-vars
    cart: { shippingAddress, paymentMethod },
  } = state;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');


  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod });
    localStorage.setItem('paymentMethod' , selectedPaymentMethod)
    navigate('/placeorder');
  };

  return (
    <div className="shipping-container ">
    <CheckoutSteps step1 step2 step3 />
    <div className="shipping-body ">
    <BackButton />
      <form className="pay-form" onSubmit={submitHandler}>
        <h1 className="pay-form-title">Méthode de paiement</h1>
        <div className="pay-form-group">
        
            <input
              type="radio"
              id="cashOnDelivery"
              value="Cash on Delivery"
              checked={selectedPaymentMethod === 'Cash on Delivery'}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            />
            <label htmlFor="cashOnDelivery">  Cash on Delivery
          </label>
        </div>
        <div className="pay-form-group">
          
            <input
              type="radio"
              id="stripe"
              value="Stripe"
              checked={selectedPaymentMethod === 'Stripe'}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            />
            <label htmlFor="stripe">
            Stripe
          </label>
        </div>
        <div className="pay-form-group">
          
            <input
              type="radio"
              id="flouci"
              value="Flouci"
              checked={selectedPaymentMethod === 'Flouci'}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            />
            <label htmlFor="flouci">
            Flouci
          </label>
        </div>
        <div className="pay-action-buttons">
          <button type="submit" className="primary">
            Continuer
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default PaymentMethodScreen;
