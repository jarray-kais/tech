import { useState } from "react";
import { forgetPassword } from "../API";
import { useMutation } from "@tanstack/react-query";
import Loading from "../components/Loading/LoadingOverlay";
import Message from "../components/Message/Message";
import BackButton from "../components/BackButton/BackButton";

const Forgetpassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const mutation = useMutation({
    mutationFn: forgetPassword,
    onSuccess: (data) => {
      setEmail("");
      setIsLoading(false);
      setIsSuccess(true);
    },
    onError: (error) => {
        const errorMessage = error.response?.data?.message || error.message || "An error occurred";
      setMessage(errorMessage);
      setIsLoading(false);
      setIsSuccess(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);
    mutation.mutate({ email });
  };
  return (
    <div className="Forget" >
    <BackButton />
      <h2>forgot Password</h2>
      <p>Please enter your email to reset the password</p>
      <form onSubmit={handleSubmit}>
          <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => {setEmail(e.target.value)}}
            required
          />
        </div>
        <button type="submit" disabled={mutation.isLoading} className="signin-button">
        {mutation.isLoading ? 'Reset Password...' : 'Reset Password'}
      </button>
      <Loading overlay={isLoading} />
      {isSuccess && <Message variant="success">Email sent successfully</Message>}
      {message && <p style={{ color:'red' }}>{message}</p>}
      </form>
    </div>
  );
};

export default Forgetpassword;
