"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    setError(""); // Reset error state
    if (!username || !password) {
      setError("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/auth/login", { username, password });

      // ✅ Store token in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful!");

      // ✅ Redirect Based on Role
      if (res.data.user.isAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }

    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.error || "Login failed!");
      } else {
        setError("Login failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      {error && <p style={styles.error}>{error}</p>}
      <button onClick={handleLogin} style={styles.button} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      <p>
        Don't have an account? <a href="/auth/signup">Signup</a>
      </p>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" },
  input: { margin: "10px", padding: "10px", width: "250px" },
  button: { padding: "10px 20px", cursor: "pointer" },
  error: { color: "red" },
};
