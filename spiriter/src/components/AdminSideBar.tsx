"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";

export default function AdminSidebar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch current user details
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });
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

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

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

  // Function to compute link classes.
  const linkClasses = (href: string) => {
    const base =
      "block py-2 px-3 transition transform hover:scale-105 hover:bg-white/10 rounded";
    const active = "text-white font-bold bg-white/10";
    const inactive = "text-white/70";
    return `${base} ${pathname === href ? active : inactive}`;
  };

  if (!user || !user.isAdmin) return null; // Show sidebar only for admins

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 text-[#76b6e4] shadow-3xl border border-cyan-500  rounded-full md:hidden"
      >
        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Responsive Sidebar */}
      <nav
        className={`fixed md:relative flex flex-col justify-between p-4 bg-black/30 backdrop-blur-md h-screen md:h-screen 
        ${isSidebarOpen ? "w-64 left-0" : "w-0 -left-64 md:w-64 md:left-0"}
        transition-all duration-300 ease-in-out border-r border-white/10 z-40 overflow-hidden`}
      >
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
              <Link
                href="/admin/players"
                className={linkClasses("/admin/players")}
              >
                Manage Players
              </Link>
            </li>
            <hr className="border-white/10" />
            <li>
              <Link
                href={"/admin/players-stats"}
                className={linkClasses("/admin/players-stats")}
              >
                Player Stats
              </Link>
            </li>
            <hr className="border-white/10" />
            <li>
              <Link
                href={"/admin/tournament-summary"}
                className={linkClasses("/admin/tournament-summary")}
              >
                Tournament Summary
              </Link>
            </li>
            <hr className="border-white/10" />
            <li>
              <Link
                href={"/admin/users"}
                className={linkClasses("/admin/users")}
              >
                Manage Users
              </Link>
            </li>
            <hr className="border-white/10" />
            <li>
              <Link
                href={"/admin/leaderboard"}
                className={linkClasses("/admin/leaderboard")}
              >
                Leaderboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Admin Details & Logout */}
        <div className="border-t border-white/10 pt-4">
          <button
            onClick={handleLogout}
            className="w-full mt-4 px-3 py-2 bg-red-500/80 text-white rounded hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>
    </>
  );
}
