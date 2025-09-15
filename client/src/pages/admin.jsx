import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import LogNavbar from "../components/logNavbar";
import { AppContent } from "../context/AppContext";

const Admin = () => {
  const [users, setUsers] = useState(() => {
    // ✅ Load initial users from localStorage if available
    const saved = localStorage.getItem("adminUsers");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { userData } = useContext(AppContent);

  // Fetch users from API when userData becomes available
  useEffect(() => {
    const fetchUsers = async () => {
      if (!userData?.tenants) return;

      setLoading(true);
      try {
        const groupQuery = `?group=${encodeURIComponent(userData.tenants)}`;
        const res = await axios.get(
          `${backendURL}/api/admin/allUsers${groupQuery}`,
          { withCredentials: true }
        );

        if (res.data?.success) {
          setUsers(res.data.data || []);
          localStorage.setItem("adminUsers", JSON.stringify(res.data.data || [])); // ✅ Save to localStorage
        } else {
          toast.error(res.data?.message || "Failed to load users");
        }
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [backendURL, userData]);

  const toggleSubscription = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === "free" ? "pro" : "free";
      const res = await axios.put(
        `${backendURL}/api/admin/updateSubscription/${userId}`,
        { subscription: newStatus },
        { withCredentials: true }
      );
      if (res.data?.success) {
        const updatedUsers = users.map((user) =>
          user._id === userId ? { ...user, subscription: newStatus } : user
        );
        setUsers(updatedUsers);
        localStorage.setItem("adminUsers", JSON.stringify(updatedUsers)); // ✅ Keep localStorage in sync
        toast.success("Subscription updated");
      } else {
        toast.error(res.data?.message || "Failed to update subscription");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update subscription");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await axios.delete(`${backendURL}/api/admin/deleteUser/${userId}`, {
        withCredentials: true,
      });
      if (res.data?.success) {
        const updatedUsers = users.filter((user) => user._id !== userId);
        setUsers(updatedUsers);
        localStorage.setItem("adminUsers", JSON.stringify(updatedUsers)); // ✅ Sync localStorage
        toast.success("User deleted");
      } else {
        toast.error(res.data?.message || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div>
      <LogNavbar />
      <div className="container mx-auto p-4 pt-24">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Subscription</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="text-center">
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b capitalize">
                    {user.subscription}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => toggleSubscription(user._id, user.subscription)}
                      className="mr-2 px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      {user.subscription === "free"
                        ? "Upgrade to Pro"
                        : "Downgrade to Free"}
                    </button>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Admin;
