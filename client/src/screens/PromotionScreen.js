import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { promotion } from "../API";

const PromotionScreen = () => {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    discountedPrice: "",
    endDate: "",
  });
  const promotionmutation = useMutation({
    mutationFn: promotion,
    onSuccess: () => {
      setMessage("Promotion added successfully!");
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    promotionmutation.mutate({ id,formData });
  };

  return (
    <div className="promotion-container">
      <form onSubmit={handleSubmit}>
        <label>Discounted Price</label>
        <input
          type="number"
          value={formData.discountedPrice}
          onChange={(e) =>
            setFormData({ ...formData, discountedPrice: e.target.value })
          }
        />
        <label>End Date</label>
        <input
          type="date"
          value={formData.endDate}
          onChange={(e) =>
            setFormData({ ...formData, endDate: e.target.value })
          }
        />
        <div className="pay-action-buttons">
                     <button type="submit" className="primary">Add Promotion</button>
                </div>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default PromotionScreen;
