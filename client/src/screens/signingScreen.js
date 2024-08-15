import { useMutation } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { signIn } from "../API";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Store } from "../Context/CartContext";



const SigningScreen = () => {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  
  const navigate = useNavigate()
    const [email , setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('');

    const mutation = useMutation({ mutationFn: signIn ,
    
        onSuccess : (data) => {
        Cookies.set('token',  data.token, { expires: 1 } )
        dispatch({ type: 'USER_SIGNIN' , payload: data});
        localStorage.setItem("userInfo", JSON.stringify(data));
        
        navigate(redirect || '/');
        
        } ,
        onError: (error) => {
          const errorMessage = error.response?.data?.message || error.message || "An error occurred";
          setMessage(errorMessage);
          },
      
    } )
    const handleSubmit = (e) => {
        e.preventDefault()
        mutation.mutate({email, password})
    }
    useEffect(() => {
      if (userInfo) {
        navigate(redirect);
      }
    }, [navigate, redirect, userInfo]);
  return (
    <div>

      <div className="signin-container">
      <div className="signin-left">
        <h2>Sign In</h2>
        <div>
          <p>
            Do not have an account, <Link to="/register" style={{color : "#2B2B2B"}}>create a new one</Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="michael.joe@xmail.com"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="*****"
            />
          </div>
          <button type="submit" disabled={mutation.isLoading} className="signin-button">
            {mutation.isLoading ? 'Signing In...' : 'Sign In'}
          </button>
            {message && <p className="error-message">{message}</p>}
        </form>
      
        <div className="center">
        <div>
          <Link to="/forget-password">Forgot Your Password</Link>
        </div>
        <div className="signin-with-google">
          <span>or</span>
          <button className="google-signin-button">
            <img src="/images/Google.png" alt="Google" /> Login up with Google
          </button>
        </div>
        </div>
      </div>
      <div >
        <img src="/images/signin.jpg" alt="Sign In" className="signin-right"/>
      </div>
    </div>^
    
  </div>
  )
}

export default SigningScreen