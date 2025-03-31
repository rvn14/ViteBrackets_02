"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { FaChevronLeft, FaChevronRight, FaTrash } from "react-icons/fa";

interface User {
  _id: string;
  username: string;
  isAdmin: boolean;
}

export default function ManageUsers() {
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

  // Toggle admin status (no confirmation here; see confirmToggleAdminStatus below)
  const toggleAdminStatus = async (userId: string) => {
    try {
      // Prevent modifying your own status
      if (currentUser?._id === userId) {
        swal("Error", "You cannot change your own admin status!", "error");
        return;
      }

      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        credentials: "include",
      });

      if (!response.ok) {
        swal("Error", "Failed to update user role", "error");
        return;
      }

      const data = await response.json();
      // Flip isAdmin in local state
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isAdmin: !u.isAdmin } : u))
      );
      swal("Success", data.message, "success");
    } catch (error) {
      console.error("Error updating user role:", error);
      swal("Error", "Error updating user role", "error");
    }
  };

  // Confirmation for toggling admin status
  const confirmToggleAdminStatus = (userId: string) => {
    const user = users.find((u) => u._id === userId);
    if (!user) return;
    const actionText = user.isAdmin ? "Demote to User" : "Make Admin";
    swal({
      title: "Confirm Role Change",
      text: `Are you sure you want to ${actionText} for ${user.username}?`,
      icon: "info",
      buttons: {
        deny: { text: "Cancel", value: false },
        confirm: { text: actionText, value: true },
      },
      dangerMode: false,
    }).then((willConfirm) => {
      if (willConfirm) {
        toggleAdminStatus(userId);
      }
    });
  };

  // Delete user function
  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        swal("Error", "Failed to remove user", "error");
        return;
      }
      // Update the local state by filtering out the deleted user
      setUsers((prev) => prev.filter((user) => user._id !== userId));
      swal("Deleted", "User removed successfully", "success");
    } catch (error) {
      console.error("Error deleting user:", error);
      swal("Error", "An error occurred while deleting the user", "error");
    }
  };

  // Confirmation for deleting a user using the bin icon
  const confirmDeleteUser = (userId: string) => {
    swal({
      title: "Delete User",
      text: "Are you sure you want to remove this user? This action cannot be undone.",
      icon: "warning",
      buttons: {
        deny: { text: "Cancel", value: false },
        confirm: { text: "Delete", value: true },
      },
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteUser(userId);
      }
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500"></div>
        <p className="ml-3 text-white/80">Loading Users...</p>
      </div>
    );
  }

  // Pagination calculations
  const totalPages = Math.ceil(users.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = users.slice(startIndex, startIndex + pageSize);

  return (
    <div className="min-h-screen p-4 sm:p-6 text-white z-10 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
      <h1 className="text-3xl sm:text-4xl text-center font-black mb-4 sm:mb-6">
        Manage Users
      </h1>

      {/* Responsive table with horizontal scroll on small screens */}
      <div className="overflow-x-auto shadow-lg rounded-lg border border-white/10 bg-white/5 bg-opacity-10">
        <table className="min-w-full border-collapse text-left text-sm font-popins">
          <thead className="bg-white/10 backdrop-blur-2xl bg-opacity-60 text-gray-200">
            <tr>
              <th className="border-b border-white/5 p-3 sm:p-4 text-center font-medium">
                Username
              </th>
              <th className="border-b border-white/5 p-3 sm:p-4 text-center font-medium">
                Role
              </th>
              <th className="border-b border-white/5 p-3 sm:p-4 text-center font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {paginatedUsers.map((user) => (
              <tr
                key={user._id}
                className="text-center hover:bg-white/5 hover:bg-opacity-40"
              >
                <td className="p-3 sm:p-4 border-white/5">{user.username}</td>
                <td className="p-3 sm:p-4 border-white/5">
                  {user.isAdmin ? "Admin" : "User"}
                </td>
                <td className="p-2 sm:p-4 border-white/5">
                  {currentUser?._id !== user._id ? (
                    <div className="flex flex-col sm:flex-row justify-center gap-2">
                      {/* Toggle admin button with confirmation */}
                      <button
                        onClick={() => confirmToggleAdminStatus(user._id)}
                        className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded font-semibold transition-colors bg-gradient-to-r ${
                          user.isAdmin
                            ? "from-red-500/80 to-red-600/80 hover:from-red-600 hover:to-red-700"
                            : "from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                        } text-white backdrop-blur-md bg-white/20 w-full sm:w-40`}
                      >
                        {user.isAdmin ? "Demote to User" : "Make Admin"}
                      </button>
                      {/* Delete button with bin icon and swal confirmation */}
                      <button
                        onClick={() => confirmDeleteUser(user._id)}
                        className="p-2 rounded transition-colors hover:bg-gray-700 flex justify-center"
                      >
                        <FaTrash size={16} color="rgba(240,50,10,0.8)" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs sm:text-sm text-gray-400 bg-white/10 p-1 sm:p-2 rounded">
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
          <span className="text-sm sm:text-base">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
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
