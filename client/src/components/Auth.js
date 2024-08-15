import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading/LoadingOverlay";
import { auth } from "../API";

const Auth = ({ children }) => {
  const navigate = useNavigate();
  const { data: checkauth, isLoading, error } = useQuery({
    queryKey: ["checkauth"],
    queryFn: auth,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const [redirectMessage, setRedirectMessage] = useState("");

  useEffect(() => {
    if (error) {
      setRedirectMessage("An error occurred. Redirecting to sign in...");
      setTimeout(() => navigate("/signin"), 500);
    } else if (checkauth && !checkauth.authenticated && !checkauth.authorized) {
      setRedirectMessage("You are not authenticated. Redirecting to sign in...");
      setTimeout(() => navigate("/signin"), 1000);
    }
  }, [checkauth, error, navigate]);

  if (isLoading) return <Loading />;

  if (redirectMessage) return <p>{redirectMessage}</p> ;

  return checkauth && (checkauth.authenticated || checkauth.authorized) ? children : null;
};

export default Auth;
