"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminSidebar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // Fetch current user details
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me", { credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, []);

  // Logout Function
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      if (response.ok) {
        router.push("/auth/login"); // Redirect to login after logout
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (!user || !user.isAdmin) return null; // Show sidebar only for admins

  return (
    <nav className="p-4 border-r bg-gray-100 h-screen">
      <h3 className="font-semibold mb-4">Admin Panel</h3>
      <ul className="space-y-2">
        <li>
          <a href="/admin/users" className="text-blue-500 hover:underline">
            Manage Users
          </a>
        </li>
        <li>
          <a href="/admin/players" className="text-blue-500 hover:underline">
            Manage Players
          </a>
        </li>
        <li>
          <a href="/admin/players-stats" className="text-blue-500 hover:underline">
            Player Stats
          </a>
        </li>
        <li>
          <a href="/admin/tournament-summary" className="text-blue-500 hover:underline">
            Tournament Summary
          </a>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="w-full mt-4 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
