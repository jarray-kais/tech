import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
    <div className="container">
      <div className="footer-top">
        <div className="footer-logo">
          <img src="/images/logo.svg" alt="Rich Technologies Logo" />
        </div>
        <div className="footer-subscribe">
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe Now</button>
        </div>
        <div className="footer-description">
          <p>
            Lorem ipsum dolor sit amet consectetur. Mi nibh venenatis in suscipit turpis enim cursus vulputate amet. Lobortis mi platea aliquam senectus tempus mauris neque.
          </p>
        </div>
      </div>
      
          <div className="footer-column">
            <h3>Website Links</h3>
            <ul>
              <li><Link to={"/"}>Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link href="/contact">Get in touch</Link></li>
              <li><Link href="/faqs">FAQs</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Services</h3>
            <ul>
              <li><Link to="/services/store">Nos magasins</Link></li>
              <li><Link to="/services/enterprise">Service enterprise</Link></li>
              <li><Link to="/services/clients">Service clients</Link></li>
              <li><Link to="/services/delivery">Service livraisons</Link></li>
              <li><Link to="/services/after-sales">Service après-vente</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Information</h3>
            <ul>
              <li><Link to="/privacy">Privacy policy</Link></li>
              <li><Link to="/terms">Terms & conditions</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Languages</h3>
            <ul>
              <li><a href="/lang/en">English</a></li>
              <li><a href="/lang/ar">Arabic</a></li>
              <li><a href="/lang/fr">French</a></li>
            </ul>
          </div>
      
      </div>
      <div className='line-horizontal'></div>
      <div className="footer-social">
        <a href="https://facebook.com"><img src="/images/facebook.svg" alt="Facebook" /></a>
        <a href="https://instagram.com"><img src="/images/instagram.svg" alt="Instagram" /></a>
        
      </div>
      <div className="footer-copy">
        <p>Non Copyrighted © 2024 Design and upload by rich technologies</p>
      </div>
    </footer>
  );
};

export default Footer;
