import './Loading.css';

const ButtonWithLoading = ({ isLoading, onClick, children }) => {
  const buttonStyle = {
    position: 'relative',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    cursor: 'pointer',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  const buttonContentStyle = {
    visibility: isLoading ? 'hidden' : 'visible',
  };

  return (
    <button 
      onClick={onClick}
      disabled={isLoading} 
      style={buttonStyle}
    >
      {isLoading && (
        <div className="lds-hourglass"></div>
      )}
      <span style={buttonContentStyle}>
        {children}
      </span>
    </button>
  );
};

export default ButtonWithLoading;
