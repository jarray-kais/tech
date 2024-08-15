import { Link } from "react-router-dom"

const FailScreen = () => {
  return (
    <div className="fail-container">
      <div className="fail-content">
        <div className="fail-icon">
          <img src="/images/error.svg" alt="errorcircle" />
        </div>
        <h2>Payment verification failed</h2>
        <p>
          Something went wrong with your payment verification. Please try again or contact support.
        </p>
        <div className="link-fail">
        <Link to="/order-history" className="button">Purchase History</Link>
        
        <Link to="/" className="button">Go to Home</Link>
      </div>
      </div>
    </div>
  )
}

export default FailScreen