/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import gsap from "gsap";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type PasswordStrengthProps = {
  passwordStrength: string;
};

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    auth: "",
  });
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

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
        error =
          "Password must include uppercase, lowercase, and special character.";
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
        confirmPassword: form.confirmPassword
          ? ""
          : "Confirm Password is required.",
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
        setErrors((prev) => ({
          ...prev,
          auth: data.error || "Signup failed.",
        }));
      } else {
        setSuccess("Signup successful! Redirecting to login...");
        setTimeout(() => router.push("/auth/login"), 2000);
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

  const PasswordStrengthDisplay: React.FC<PasswordStrengthProps> = ({
    passwordStrength,
  }) => {
    const getStrengthClass = (strength: string) => {
      if (strength === "Weak") return "text-red-500";
      if (strength === "Moderate") return "text-yellow-500";
      if (strength === "Strong") return "text-green-500";
      return "";
    };

    return (
      <p>
        Password Strength:{" "}
        <strong className={getStrengthClass(passwordStrength)}>
          {passwordStrength}
        </strong>
      </p>
    );
  };

  return (
    <div className="loginpage relative w-full h-screen flex justify-center items-center bg-gray-950 text-white">
      <img
        className="absolute z-0 opacity-5 w-full h-full"
        src="/images/grid.png"
        alt=""
      />
      <div className="absolute gradDot top-0 rounded-full w-1/2 h-[500px] bg-[#1789DC] blur-[150px] transform -translate-y-1/2 z-0"></div>

      <div className="flex items-center justify-center w-3/5 h-full z-20">
        <div className="hidden xl:flex w-full p- ">
          <img ref={imgRef}
            className="object-center object-cover"
            src="/images/logo.png"
            alt=""
          />
        </div>
        <div ref={formRef} className="w-full p-10 flex items-center justify-center z-10">
          <div className="w-[450px] h-[550px] bg-white/2 backdrop-blur-lg shadow-[0_5px_15px_rgba(0,0,0,0.35)] rounded-[10px] box-border py-[60px] px-[40px]">
            {/* Title */}
            <p className="text-center mt-[10px] mb-[30px] text-[28px] font-extrabold">
              Create account
            </p>

            {/* Sub-title */}
            <p className="text-center text-[12px] text-cyan-100 mt-[-19px] mb-2">
              Sign up to get started
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
                required
              />

              {/* Password Strength Indicator */}
              <PasswordStrengthDisplay passwordStrength={passwordStrength} />
              <input
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                type="password"
                placeholder="Confirm Password"
                className="rounded-[10px] border border-[#c0c0c0]/5 outline-none py-[12px] px-[15px]"
                required
              />

              {errors.confirmPassword && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.confirmPassword}
                </p>
              )}

              {errors.auth && (
                <p
                  style={{
                    color: "red",
                    fontSize: "14px",
                    marginBottom: "10px",
                  }}
                >
                  {errors.auth}
                </p>
              )}

              <button
                type="submit"
                className="py-[10px] px-[15px] rounded-[20px] outline-none bg-gradient-to-r from-cyan-500 to-blue-500 text-white cursor-pointer shadow-[0_3px_8px_rgba(0,0,0,0.24)] active:shadow-none hover:scale-97 transition duration-100 ease-in"
              >
                Create account
              </button>
            </form>

            {/* Sign-up label */}
            <p className="m-0 text-[10px] text-cyan-100 ml-1">
              Already have an account?
              <span
                onClick={() => router.push("/auth/login")}
                className="ml-[1px] text-[11px] underline decoration-cyan-600 text-cyan-400 cursor-pointer font-extrabold"
              >
                Log in
              </span>
            </p>

            {success &&
              toast.success("Registered Successfully!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
