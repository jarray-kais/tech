import { useEffect, useState } from "react";
import { admin } from "../API";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading/LoadingOverlay";
import { useNavigate } from "react-router-dom";

const Admin = ({ children }) => {
  const [unauthorizedMessage, setUnauthorizedMessage] = useState("");
  const navigate = useNavigate();

  const {
    data: checkadmin,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["checkadmin"],
    queryFn: admin,
    retry: false,
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (
      error ||
      (checkadmin && !checkadmin.authenticated && !checkadmin.authorized)
    ) {
      setUnauthorizedMessage("you are not authorized");
      navigate("/signin");
    }
  }, [checkadmin, error, navigate]);

  if (isLoading) return <Loading />;
  if (unauthorizedMessage) {
    return <div>{unauthorizedMessage}</div>;
  }


  return checkadmin && (checkadmin.authenticated || checkadmin.authorized)
    ? children
    : null;
};

export default Admin;
