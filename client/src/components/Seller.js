import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { sellerOrAdmin } from "../API";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading/LoadingOverlay";

const Seller = ({children}) => {
  const navigate = useNavigate();
  const [unauthorizedMessage, setUnauthorizedMessage] = useState("");

  const {
    data: checkseller,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["checkseller"],
    queryFn: sellerOrAdmin,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (error ||
        ( checkseller && !checkseller.authenticated && !checkseller.authorized)) {
      setUnauthorizedMessage("You are not authorized");
      navigate("/signin");
    }
  }, [navigate, error, checkseller]);

  if (isLoading) {
    return <Loading />;
  }

  if (unauthorizedMessage) {
    return <div>{unauthorizedMessage}</div>;
  }

  return checkseller && (checkseller.authenticated || checkseller.authorized)
    ? children
    : null;
};

export default Seller;
