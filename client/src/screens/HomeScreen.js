import { Link } from "react-router-dom";
import Bestdeal from "../components/Best-Deal/Bestdeal";
import FeaturedProducts from "../components/featuredProduct/FeaturedProducts";
import ImageCarousel from "../components/ImageCarousel/ImageCarousel";
import Shopwithcategory from "../components/ShopWithCategory/Shopwithcategory";
import Accessoires from "../components/Accessoires/Accessoires";

const HomeScreen = () => {
  return (
    <div className="home">
      <ImageCarousel />
      <FeaturedProducts />
      <Bestdeal />
      <div className="Xiaomi">
        <div className="left">
          <div className="left_left">
            <h4 className="introducing">INTRODUCING</h4>
            <div className="name">
              <p>New Apple Homepod Mini</p>
            </div>
            <div>
              <p>
                Jam-packed with innovation, HomePod mini delivers unexpectedly.
              </p>
            </div>
            <button className="add-to-card-button">Shop Now</button>
          </div>
          <div>
            <img src="/images/apple.svg" alt="" />
          </div>
        </div>
        <div className="right">
          <div className="right-left">
            <h4 className="introducing-right">INTRODUCING New</h4>
            <div className="name-right">
              <p>New Apple Homepod Mini</p>
            </div>
            <div style={{ color: "#ADB7BC" }}>
              <p>
                Jam-packed with innovation, HomePod mini delivers unexpectedly.
              </p>
            </div>
            <button className="add-to-card-button">Shop Now</button>
          </div>
          <div className="right-right">
            <div className="prix">590 TND</div>
            <div className="image-right">
              <img src="/images/telephone.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
      <Shopwithcategory />
      <div className="lorem">
        <div className="lorem-left">
          <h1>Have a Look at Our Unique Selling Proportions</h1>
          <Link to="#">
            <button className="add-to-card-button" id="Read-buuton">
              Read MOre
            </button>
          </Link>
        </div>
        <div className="lorem-right">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            varius enim in eros elementum tristique. Duis cursus, mi quis
            viverra ornare, eros dolor interdum nulla, ut commodo diam libero
            vitae erat.
          </p>
          <div className="parag">
            <div className="left-paragr">
              <h3>90%</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse varius enim in eros.
              </p>
            </div>
            <div className="right-paragr">
              <h3>100%</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse varius enim in eros.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="right-mac">
        <div className="right-left">
          <h4 className="introducing-right">SAVE UP TO $200.00</h4>
          <div className="name-mac">
            <p>Macbook Pro</p>
          </div>
          <div style={{ color: "#ADB7BC" }}>
            <p>Apple M1 Max Chip. 32GB Unified Memory, 1TB SSD Storage</p>
          </div>
          <button className="add-to-card-button">Shop Now</button>
        </div>
        <div className="right-right">
          <div className="prix">1199 TND</div>
          <div className="image-mac">
            <img src="/images/mackbook.svg" alt="" />
          </div>
        </div>
      </div>
      <Accessoires />
    </div>
  );
};

export default HomeScreen;
