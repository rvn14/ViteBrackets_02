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
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          router.push("/auth/login");
          return;
        }
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/auth/login");
      }
    }

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  }

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
