import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { resetPassword } from "../API";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading/LoadingOverlay";

const ResetPassword = () => {
    const navigate = useNavigate()
    const {token} = useParams()
    const [password, setPassword] = useState('')
    const [confirmedpassword, setConfirmedPassword] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const mutation = useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            setMessage('Password reset successfully');
            navigate('/signin');
            setIsLoading(false)
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setMessage(errorMessage);
            setIsLoading(false)
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        if(password !== confirmedpassword){
            setMessage('Passwords do not match')
            setIsLoading(true)
            return
        }
        mutation.mutate({password , token})
    }
  return (
 
    <div className="Forget">   
    <h2>forgot Password</h2>
    <p>Create a new password. Ensure it differs from
    previous ones for security</p>
    <form onSubmit={handleSubmit}>
    <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>confirmed Password:</label>
        <input
          type="password"
          name="confirmedPassword"
          value={confirmedpassword}
          onChange={(e)=>setConfirmedPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={mutation.isLoading} className="signin-button">
        {mutation.isLoading ? 'Update Password...' : 'Update Password'}
      </button>
      </form>
      <Loading overlay={isLoading} />
      {message && <p style={{ color:'red' }}>{message}</p>}
    </div>
  )
}

export default ResetPassword