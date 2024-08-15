import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, updateUser } from "../API";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EditUser = () => {
  const {id} = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [message, setMessage] = useState("")
  const queryClient = useQueryClient();
  const {
    data: user,
    // eslint-disable-next-line no-unused-vars
    isLoading: orderloading,
    // eslint-disable-next-line no-unused-vars
    error: ordererror,
  } = useQuery({
    queryKey: ["finduser", id],
    queryFn: () => getUser(id),
    rating: 1,
    refetchInterval: 60000,
    staleTime: 10000,
  });

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setIsAdmin(user.isAdmin || false);
      setIsSeller(user.isSeller || false);
    }
  }, [user]);


  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      alert('succefuuly updated')
      queryClient.invalidateQueries(["get"]);
    },
    onError: (error) => {
      const errorResponse = error.response.data.message;
      console.log( error.response && error.response.data.message
        ? error.response.data.message
        : error.message)
      setMessage(errorResponse);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      name,
      email,
      isAdmin,
      isSeller,
    };
    updateMutation.mutate({ id: id, updatedData });
    setName(user.name);
    setEmail(user.email);
    setIsAdmin(user.isAdmin);
    setIsSeller(user.isSeller);
  };

  return (
    <div className="track-order-container">
      <h2>Edit user</h2>
      <form onSubmit={handleSubmit}>
      <div className="track-order-form">
        <input
          type="text"
          placeholder={name}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder={email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>
          <input
           id="isAdmin"
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          Admin
        </label>
        <label>
          <input
           id="isSeller"
            type="checkbox"
            checked={isSeller}
            onChange={(e) => setIsSeller(e.target.checked)}
          />
          Seller
        </label>


          <div className="pay-action-buttons">
            <button type="submit" className="primary">
              Edit
            </button>
            
          </div>{message && <p style={{ color: "red" }}>{message}</p>}
        </div>
      </form>
    </div>
  );
};

export default EditUser;
