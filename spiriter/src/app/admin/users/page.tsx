"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface User {
  _id: string;
  username: string;
  isAdmin: boolean;
}

export default function ManageUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Fetch users on mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/admin/users", { credentials: "include" });
        if (!response.ok) {
          toast.error("Unauthorized access");
          return;
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    }

    async function fetchCurrentUser() {
      try {
        const response = await fetch("/api/auth/me", { credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    }

    fetchUsers();
    fetchCurrentUser();
  }, []);

  // Promote or Demote User
  const toggleAdminStatus = async (userId: string) => {
    try {
      if (currentUser?._id === userId) {
        toast.error("You cannot change your own admin status!");
        return;
      }

      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("Failed to update user role");
        return;
      }

      const data = await response.json();
      setUsers(users.map((u) => (u._id === userId ? { ...u, isAdmin: !u.isAdmin } : u)));
      toast.success(data.message);
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Error updating user role");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <table className="w-full border-collapse border border-gray-300 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Username</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="border p-2">{user.username}</td>
              <td className="border p-2">{user.isAdmin ? "Admin" : "User"}</td>
              <td className="border p-2">
                {currentUser?._id !== user._id && (
                  <button
                    onClick={() => toggleAdminStatus(user._id)}
                    className={`px-3 py-1 rounded ${
                      user.isAdmin ? "bg-red-500" : "bg-blue-500"
                    } text-white`}
                  >
                    {user.isAdmin ? "Demote to User" : "Make Admin"}
                  </button>
                )}
                {currentUser?._id === user._id && (
                  <span className="text-gray-400">Cannot modify yourself</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
