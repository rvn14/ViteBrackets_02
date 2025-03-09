"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // Fetch users on mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/admin/users", {
          credentials: "include", // ensure cookies are sent
        });
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
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });
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
      // Flip isAdmin in local state
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isAdmin: !u.isAdmin } : u))
      );
      toast.success(data.message);
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Error updating user role");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  // Pagination calculations
  const totalPages = Math.ceil(users.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = users.slice(startIndex, startIndex + pageSize);

  return (
    <div className="min-h-screen p-6 text-white z-1000 px-24">
      <h1 className="text-4xl text-center font-black mb-6">Manage Users</h1>

      <div className="overflow-x-auto shadow-lg rounded-lg border border-white/10 bg-white/5 bg-opacity-10">
        <table className="min-w-full border-collapse text-left text-sm font-popins">
          <thead className="bg-white/10 backdrop-blur-2xl bg-opacity-60 text-gray-200">
            <tr>
              <th className="border-b border-white/5 p-4 text-center font-medium">Username</th>
              <th className="border-b border-white/5 p-4 text-center font-medium">Role</th>
              <th className="border-b border-white/5 p-4 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {paginatedUsers.map((user) => (
              <tr key={user._id} className="text-center hover:bg-white/5 hover:bg-opacity-40">
                <td className="p-4 border-white/5">{user.username}</td>
                <td className="p-4 border-white/5">
                  {user.isAdmin ? "Admin" : "User"}
                </td>
                <td className="p-4 border-white/5">
                  {currentUser?._id !== user._id ? (
                    <div className="flex justify-center">
                      <button
                        onClick={() => toggleAdminStatus(user._id)}
                        className={`w-40 px-3 py-1 rounded font-semibold transition-colors bg-gradient-to-r ${
                          user.isAdmin
                            ? "from-red-500/80 to-red-600/80 hover:from-red-600 hover:to-red-700"
                            : "from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                        } text-white backdrop-blur-md bg-white/20`}
                      >
                        {user.isAdmin ? "Demote to User" : "Make Admin"}
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400 bg-white/10 p-2 rounded">
                      Cannot modify yourself
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 bg-gray-700 rounded disabled:opacity-50"
          >
            <FaChevronLeft size={20} />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 bg-gray-700 rounded disabled:opacity-50"
          >
            <FaChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}