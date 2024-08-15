import { Link } from 'react-router-dom';
import './CheckoutSteps.css';

export default function CheckoutSteps(props) {
  return (
    <div className="checkout-steps">
        <div className={`step ${props.step1 ? 'active' : ''}`}>Sign In</div>
      
      {props.step2 ? (
        <Link to="/shipping" className="step active">Adresse</Link>
      ) : (
        <div className="step">Adresse</div>
      )}
      {props.step3 ? (
        <Link to="/payment" className="step active">Méthode de paiement</Link>
      ) : (
        <div className="step">Méthode de paiement</div>
      )}
      {props.step4 ? (
        <Link to="/placeorder" className="step active">Passer la commande</Link>
      ) : (
        <div className="step">Passer la commande</div>
      )}
    </div>
  );
}