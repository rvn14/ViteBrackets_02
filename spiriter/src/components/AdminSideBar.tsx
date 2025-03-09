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
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
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
    <nav className="flex flex-col justify-between p-4 bg-black/20 h-screen w-64 border-r border-white/10">
      <div>
        <img
          src="/images/logo-hor.png"
          alt="Spiriter"
          className="w-32 mx-auto mt-8"
        />
        <h2 className="text-white text-center font-black font-poppins mb-8">
          Admin Panel
        </h2>
        <ul className="space-y-2">
          <li>
            <a
              href="/admin/players"
              className="text-white/70 py-2 px-1 hover:text-white"
            >
              Manage Players
            </a>
          </li>
          <hr className="border-white/10" />
          <li>
            <a
              href="/admin/players-stats"
              className="text-white/70 hover:text-white"
            >
              Player Stats
            </a>
          </li>
          <hr className="border-white/10" />
          <li>
            <a
              href="/admin/tournament-summary"
              className="text-white/70 hover:text-white"
            >
              Tournament Summary
            </a>
          </li>
          <hr className="border-white/10" />
          <li>
            <a
              href="/admin/users"
              className="text-white/70 hover:text-white"
            >
              Manage Users
            </a>
          </li>
        </ul>
      </div>

      {/* Admin Details & Logout */}
      <div className="border-t border-white/10 pt-4">
        <button
          onClick={handleLogout}
          className="w-full mt-4 px-3 py-2 bg-red-500/80 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}