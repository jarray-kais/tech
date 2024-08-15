import { useNavigate } from 'react-router-dom';
import './BackButton.css';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <button onClick={handleBackClick} className="back-button">
      <img src='/images/back.svg' alt='vector' className="back-icon"/>
    </button>
  );
};

export default BackButton;
