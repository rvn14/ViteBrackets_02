"use client";
import gsap from "gsap";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    auth: "",
  });
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const imgRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    gsap.set(formRef.current, { y: -20, opacity: 0 });
    gsap.to(formRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      delay: 0.2,
    });

    gsap.set(imgRef.current, { scale: 0.97, opacity: 0 });
    gsap.to(imgRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.7,
    });

    gsap.set(".gradDot", { x: -200, y: -200, opacity: 0 });
    gsap.to(".gradDot", {
      x: 0,
      y: 0,
      opacity: 0.6,
      duration: 0.7,
    });
  }, []);


  // ✅ Real-time validation
  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "username" && value.length < 8) {
      error = "Username must be at least 8 characters long.";
    }

    if (name === "password" && value.length < 6) {
      error = "Password must be at least 6 characters long.";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Validate as user types
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setErrors((prev) => ({ ...prev, auth: "" }));
    setLoading(true);
    localStorage.setItem("isSigned", "true");

    // ✅ Final validation check before sending request
    if (!form.username || !form.password) {
      setErrors({
        ...errors,
        username: form.username ? "" : "Username is required.",
        password: form.password ? "" : "Password is required.",
      });
      setLoading(false);
      return;
    }

    if (errors.username || errors.password) {
      setLoading(false);
      return; // Stop submission if errors exist
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrors((prev) => ({ ...prev, auth: data.error || "Login failed." }));
      } else {

        setSuccess("Login successful! Redirecting...");
        setTimeout(() => router.push("/"), 2000);
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        auth: "An error occurred. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginpage relative w-full h-screen flex justify-center items-center bg-gray-950 text-white">
      <img
        className="absolute z-0 opacity-5 w-full h-full"
        src="/images/grid.png"
        alt=""
      />
      <div className="absolute gradDot top-0 rounded-full w-1/2 h-[500px]  bg-[#1789DC] blur-[150px] transform -translate-y-1/2 z-0"></div>
      <div className="flex items-center justify-center w-3/5 h-full z-20">
        <div className="hidden xl:flex w-full p- ">
          <img
            ref={imgRef}
            className="object-center object-cover"
            src="/images/logo.png"
            alt=""
          />
        </div>
        <div
          ref={formRef}
          className="w-full p-10 flex items-center justify-center z-10"
        >
          <div className="w-[450px] h-[500px] bg-white/2 backdrop-blur-lg border-1 border-white/10 shadow-[rgba(253,252,252,0.5)] rounded-[10px] box-border py-[60px] px-[40px]">
            {/* Title */}
            <p className="text-center mt-[10px] mb-[30px] text-[28px] font-extrabold">
              Welcome back
            </p>

            {/* Form */}
            <form
              className="w-full flex flex-col gap-[18px] mb-[15px]"
              onSubmit={handleSubmit}
            >
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                type="text"
                placeholder="Username"
                className="rounded-[10px] border border-[#c0c0c0]/5 outline-none py-[12px] px-[15px]"
                required
              />
              {errors.username && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.username}
                </p>
              )}
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                placeholder="Password"
                className="rounded-[10px] border border-[#c0c0c0]/5 outline-none py-[12px] px-[15px]"
              />
              {errors.password && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.password}
                </p>
              )}

              {/* Authentication Error */}
              {errors.auth && <p style={{ color: "red" }}>{errors.auth}</p>}

              <p className="underline m-0 text-end text-cyan-400 decoration-cyan-600">
                <span className="cursor-pointer text-[9px] font-bold hover:text-cyan-300">
                  Forgot Password?
                </span>
              </p>
              <button
                type="submit"
                className="py-[10px] px-[15px] rounded-[20px] outline-none bg-gradient-to-r from-cyan-500 to-blue-500 text-white cursor-pointer shadow-[0_3px_8px_rgba(0,0,0,0.24)] active:shadow-none hover:scale-97 transition duration-100 ease-in"
              >
                Log in
              </button>
            </form>

            {/* Sign-up Link */}
            <p className="m-0 text-[10px] text-cyan-100">
              Don&apos;t have an account?
              <span
                onClick={() => router.push("/auth/signup")}
                className="ml-[1px] text-[11px] underline decoration-cyan-600 text-cyan-400 cursor-pointer font-extrabold"
              >
                Sign up
              </span>
            </p>

            {/* Success Message */}
            {success &&
              toast.success("Logged in Successfully!")}
          </div>
        </div>
      </div>
    </div>
  );
}
