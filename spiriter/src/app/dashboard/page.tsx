"use client";
import { useEffect, useState, CSSProperties } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  interface User {
    username: string;
    // Add other user properties if needed
  }

  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/auth/login"); // ✅ Redirect to login if not authenticated
    } else {
      setUser(JSON.parse(userData)); // ✅ Set user state
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Remove token
    localStorage.removeItem("user");  // ✅ Remove user data
    router.push("/auth/login"); // ✅ Redirect to login
  };

  if (!user) return <h2>Loading...</h2>;

  return (
    <div style={styles.container}>
      <h2>Welcome, {user.username}!</h2>
      <button onClick={handleLogout} style={styles.button}>Logout</button>
    </div>
  );
}

const styles: { container: CSSProperties; button: CSSProperties } = {
  container: { textAlign: "center", marginTop: "50px" },
  button: { padding: "10px 20px", cursor: "pointer" },
};
