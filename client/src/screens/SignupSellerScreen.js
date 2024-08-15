import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { sellerSignup } from "../API";
import { Link, useNavigate } from "react-router-dom";


const SignupSellerScreen = () => {
  const navigate = useNavigate();
  const [check, setCheck] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileName1, setFileName1] = useState('');
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone: "",
    Country: "",
    profilePicture: null,
    isSeller: true,
    isAdmin: false,
    nameBrand: "",
    Address: "",
    logo: null,
    description: "",
  });

  const mutation = useMutation({
    mutationFn: sellerSignup,
    onSuccess: (data) => {
      console.log(data);
      navigate("/signin");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || "An error occurred";
      setMessage(errorMessage);
    },
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" || name === "logo") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    mutation.mutate(formData);
  };

  const handleChangeFile = (event) => {
    const { name, files } = event.target;
    if (files.length > 0) {
      if (name === 'profilePicture') {
        setFileName(files[0].name);
      } else if (name === 'logo') {
        setFileName1(files[0].name);
      }
      setFormData({
        ...formData,
        [name]: files[0],
      });
    }
  };

  return (
    <div>
      <div className="signup">
        <h2>Become A Seller</h2>
        <div>
          <p style={{ fontSize: "16px" }}>
            Already Have An Account,{" "}
            <Link style={{ color: "#2B2B2B" }} to={"/signin"}>
              Login
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Name of Brand:</label>
            <input
              type="text"
              name="nameBrand"
              value={formData.nameBrand}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Telephone:</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Seller Address:</label>
            <input
              type="text"
              name="Address"
              value={formData.Address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Country:</label>
            <input
              type="text"
              name="Country"
              value={formData.Country}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group file-upload">
            <label>Photo de profil:</label>
            <div className="file-input">
              <input
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={handleChangeFile}
                required
                id="file-profile"
                className="file"
              />
              <label htmlFor="file-profile" className="file-label">
                Choisir un fichier
              </label>
              <span className="file-name">
                {fileName || "Aucun fichier choisi"}
              </span>
            </div>
          </div>
          <div className="form-group file-upload">
            <label>Logo:</label>
            <div className="file-input">
              <input
                type="file"
                name="logo"
                accept="image/*"
                onChange={handleChangeFile}
                required
                id="file-logo"
                className="file"
              />
              <label htmlFor="file-logo" className="file-label">
                Choisir un fichier
              </label>
              <span className="file-name">
                {fileName1 || "Aucun fichier choisi"}
              </span>
            </div>
          </div>
          <div className="checkbox-container">
            <label className="custom-checkbox">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={check}
                onChange={(e) => setCheck(e.target.checked)}
                required
              />
              <span className="checkmark"></span>
              I have read and agreed to the{" "}
              <Link to="/terms" className="link">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="link">
                Privacy Policy
              </Link>
            </label>
          </div>
          <button
            type="submit"
            disabled={mutation.isLoading || !check}
            className="signin-button"
          >
            {mutation.isLoading ? "Creating Account..." : "Create Account"}
          </button>
          {message && <p style={{ color: "red" }}>{message}</p>}
        </form>
        <div className="signin-with-google signup-with-google">
          <div>
            <div className="horizontal"></div>
            <span>or</span>
            <div className="horizontal"></div>
          </div>
          <button className="google-signin-button">
            <img src="/images/Google.png" alt="Google" /> Sign up with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupSellerScreen;