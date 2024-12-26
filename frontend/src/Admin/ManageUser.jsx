import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import axiosInstance from "../utils/api/axiosInstance"; // Assuming CustomFetch is set up correctly for your axios instance

const ManageUsers = () => {
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open2, setOpen2] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosInstance.get("/user/admin/users");
        setUsers(data.users);
        console.log(data.users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Delete a user
  const deleteUser = async (id) => {
    try {
      await axiosInstance.delete(`/user/admin/user/${id}`);
      toast.success("User deleted successfully");
      // Re-fetch users after deletion
      const { data } = await axiosInstance.get("/user/admin/users");
      setUsers(data.users);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
  };

  // Update user role (make user admin or vice versa)
  const updateUserRole = async (role, id) => {
    try {
      await axiosInstance.put(`/user/admin/user/${id}`, { role });
      toast.success("Role updated successfully");
      // Re-fetch users after role update
      const { data } = await CustomFetch.get("/user/admin/users");
      setUsers(data.users);
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Error updating role");
    }
  };

  // Handle modal actions
  const handleOpen = (id) => {
    setOpen2(true);
    setUserId(id);
  };

  const handleClose = () => {
    setOpen2(false);
  };

  const handleDelete = () => {
    deleteUser(userId);
    setOpen2(false);
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="p-6">
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th>Username</th>
              <th>Image</th>
              <th>Email</th>
              <th>Role</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-24 h-24 rounded-full"
                  />
                </td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="text-center flex gap-4 justify-center items-center">
                  <button
                    className="btn btn-error"
                    onClick={() => handleOpen(user._id)}
                  >
                    Delete
                  </button>

                  {user.role === "user" ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => updateUserRole("admin", user._id)}
                    >
                      Make Admin
                    </button>
                  ) : (
                    <button
                      className="btn btn-warning"
                      onClick={() => updateUserRole("user", user._id)}
                    >
                      Make User
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Confirmation */}
      {open2 && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-lg font-semibold">
              Are you sure you want to delete?
            </h3>
            <div className="mt-4 flex justify-end gap-4">
              <button className="btn btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
