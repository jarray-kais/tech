import { useState } from "react";

const PasswordInput = ({ label, name, value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{ position: "relative", width: "450px", marginBottom: "15px" }}>
      <label>{label}</label>
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        style={{
          padding: "10px 40px 10px 10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          width: "100%",
        }}
      />
      <span
        onClick={togglePasswordVisibility}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
         
          cursor: "pointer",
        }}
      >
        <i
          className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}
        ></i>
      </span>
    </div>
  );
};

export default PasswordInput;
