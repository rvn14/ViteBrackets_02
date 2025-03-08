"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const activeUser = localStorage.getItem("active_user");
    if (!activeUser) {
      router.push("/auth/login");
      return;
    }

    const token = localStorage.getItem(`token_${activeUser}`);

    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      // Decode JWT token
      const decodedToken: { username: string; exp: number } = jwtDecode(token);

      // Check if token has expired
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem(`token_${activeUser}`);
        localStorage.removeItem("active_user");
        router.push("/auth/login");
        return;
      }

      setUsername(decodedToken.username);
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem(`token_${activeUser}`);
      localStorage.removeItem("active_user");
      router.push("/auth/login");
    }
  }, [router]);

  const handleLogout = () => {
    const activeUser = localStorage.getItem("active_user");
    if (activeUser) {
      localStorage.removeItem(`token_${activeUser}`);
      localStorage.removeItem("active_user");
    }
    router.push("/auth/login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome, {username}!</h1>
      <p>You have successfully logged in.</p>
      <button onClick={handleLogout} style={{ marginTop: "20px", padding: "10px 20px" }}>
        Log Out
      </button>
    </div>
  );
}
