"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ username: "", password: "", confirmPassword: "", auth: "" });
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  // ✅ Password Strength Indicator
  const checkPasswordStrength = (password: string) => {
    let strength = "Weak";
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(password)) {
      strength = "Strong";
    } else if (/(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(password)) {
      strength = "Moderate";
    }
    setPasswordStrength(strength);
  };

  // ✅ Real-time Validation
  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "username" && value.length < 8) {
      error = "Username must be at least 8 characters long.";
    }

    if (name === "password") {
      checkPasswordStrength(value);
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(value)) {
        error = "Password must include uppercase, lowercase, and special character.";
      }
    }

    if (name === "confirmPassword" && value !== form.password) {
      error = "Passwords do not match.";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Validate in real-time
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setErrors((prev) => ({ ...prev, auth: "" }));
    setLoading(true);

    if (!form.username || !form.password || !form.confirmPassword) {
      setErrors({
        ...errors,
        username: form.username ? "" : "Username is required.",
        password: form.password ? "" : "Password is required.",
        confirmPassword: form.confirmPassword ? "" : "Confirm Password is required.",
      });
      setLoading(false);
      return;
    }

    if (errors.username || errors.password || errors.confirmPassword) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrors((prev) => ({ ...prev, auth: data.error || "Signup failed." }));
      } else {
        setSuccess("Signup successful! Redirecting to login...");
        setTimeout(() => router.push("/auth/login"), 2000);
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, auth: "An error occurred. Please try again." }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "300px", margin: "0 auto" }}>
        <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        {errors.username && <p style={{ color: "red", fontSize: "12px" }}>{errors.username}</p>}

        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        {errors.password && <p style={{ color: "red", fontSize: "12px" }}>{errors.password}</p>}
        <p>Password Strength: <strong>{passwordStrength}</strong></p>

        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
        {errors.confirmPassword && <p style={{ color: "red", fontSize: "12px" }}>{errors.confirmPassword}</p>}

        {errors.auth && <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>{errors.auth}</p>}

        <button type="submit" disabled={loading} style={{ cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}
