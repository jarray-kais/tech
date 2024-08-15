import './OrderPgress.css'
const OrderProgress = ({order}) => {
  return (
    <div className="order-progress">
      <div className="progress-steps">
        <div className="stepp completed">
          <img src="/images/Placed.svg" alt="Order Placed" />
          <span>Order Placed</span>
        </div>
        <div className={`step ${order?.packaging ? 'completed' : ''}`}>
          <img src="/images/Package.svg" alt="Packaging" />
          <span>Packaging</span>
        </div>
        <div className={`step ${order?.onTheRoadBeforeDelivering ? 'completed' : ''}`}>
          <img src="/images/OntheRoad.svg" alt="On The Road" />
          <span>On The Road</span>
        </div>
        <div className={`step ${order?.isDelivered ? 'completed' : ''}`}>
          <img src="/images/delivred.svg" alt="Delivered" />
          <span>Delivered</span>
        </div>
      </div>
    </div>
  )
}

export default OrderProgress