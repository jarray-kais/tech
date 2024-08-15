import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, getUsers } from "../API";
import { useState } from "react";
import Navigationsidebaruser from "../components/NAvigationSideBarUser/Navigationsidebaruser";
import Loading from "../components/Loading/Loading";
import Message from "../components/Message/Message";
import { Link } from "react-router-dom";

const UserListScreen = () => {
    const [page , setPage]=useState(1)
     // eslint-disable-next-line no-unused-vars
  const [limit, setLimit]=useState(7)
  const queryClient = useQueryClient();

    const{
        data : user ,
        isLoading ,
        error ,
    } = useQuery({
        queryKey : ["user" , page , limit],
        queryFn :()=> getUsers(page , limit),
        retry : 0,
        refetchOnWindowFocus : false,
        cacheTime : 10000,
        staleTime : 10000 * 60 * 5,
    })
    console.log(user)
    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess :()=>{
          alert("Order deleted successfully")
          queryClient.invalidateQueries(["user"])
        }
      })
      const handleDelete = (userId) => { 
        if (window.confirm("Are you sure you want to delete this order?")) {
          deleteMutation.mutate(userId);
        }
      };

      const handleNextPage = () => {
        setPage((old) => old + 1);
      };
    
      const handlePreviousPage = () => {
        setPage((old) => Math.max(old - 1, 1));
      };

      const totalPages = Math.ceil(user?.totalCount /limit)
    
  return (
    <div className="dash">
      <div className="dash-user">
        <Navigationsidebaruser />
      </div>
      <div className="dash-content">
      <div className="dash-title">
        <h2>All users</h2>
      </div>
      {isLoading ? (<Loading />) : error ? (<Message variant="danger">{error?.message}</Message>) : (
        <>
        <table className="order-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>isAdmin</th>
                  <th>isSeller</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
              
                {user?.users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>
                     {user.name}
                    </td>
                    <td >{user.email}</td>
                    <td >{user.isAdmin ? "true" : "false" }</td>
                    <td>
                    {user.isSeller ? "true" : "false" }
                </td>
                <td>
                 
                    <div>
                      <Link className="action-button view-details" to={`/user/${user._id}` } >
                        <span style={{ color: "green" }}>Edit ➔</span>
                      </Link>
                      <button className="action-button delete-button" style={{ color: "red" }}
                       onClick={() => handleDelete(user._id)}>
                        Delete
                      </button>
                    </div>
                </td>
                  </tr>
                ))}
              </tbody>
        </table>
        <div className="pagination-container">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className={`pagination-button ${page === 1 ? "disabled" : ""}`}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
            <div
              key={pageNum}
              className={`pagination-number ${page === pageNum ? "active" : ""}`}
              onClick={() => setPage(pageNum)}
            >
              {pageNum}
            </div>
          ))}
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className={`pagination-button ${page === totalPages ? "disabled" : ""}`}
          >
            &gt;
          </button>
        </div>

        </>
      ) }
      </div>
      </div>
  )
}

export default UserListScreen