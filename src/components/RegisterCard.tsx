"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FormError {
  name?: string;
  email?: string;
  no_handphone?: string;
  password?: string;
  repeat_password?: string;
  submit?: string;
}

export default function RegisterCard() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    no_handphone: "",
    password: "",
    repeat_password: "",
  });
  const [errors, setErrors] = useState<FormError>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: FormError = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.no_handphone)
      newErrors.no_handphone = "Phone number is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.repeat_password) {
      newErrors.repeat_password = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear error when user types
    if (errors[e.target.name as keyof FormError]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: undefined,
      }));
    }
  };

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: formData.name,
          email: formData.email,
          nohandphone: formData.no_handphone,
          password: formData.password,
          repeat_password: formData.repeat_password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to register");
      }

      const data = await response.json();

      if (data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        throw new Error(data.error || "Registration failed");
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error instanceof Error ? error.message : "Registration failed",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[360px] h-[520px] bg-white rounded-[3px] p-[16px] flex flex-col justify-between text-[#253D4E]">
      <h1 className="font-semibold text-[48px] text-center">Sign Up</h1>
      <form className="flex flex-col gap-[12px]" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            className={`focus:outline-none w-full border-[2px] px-[12px] py-[3px] rounded-[12px] ${
              errors.name ? "border-red-500" : "border-[#0B9343]"
            }`}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            className={`focus:outline-none w-full border-[2px] px-[12px] py-[3px] rounded-[12px] ${
              errors.email ? "border-red-500" : "border-[#0B9343]"
            }`}
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            className={`focus:outline-none w-full border-[2px] px-[12px] py-[3px] rounded-[12px] ${
              errors.no_handphone ? "border-red-500" : "border-[#0B9343]"
            }`}
            name="no_handphone"
            value={formData.no_handphone}
            onChange={handleChange}
            placeholder="No Handphone"
            disabled={isLoading}
          />
          {errors.no_handphone && (
            <p className="text-red-500 text-xs mt-1">{errors.no_handphone}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            className={`focus:outline-none w-full border-[2px] px-[12px] py-[3px] rounded-[12px] ${
              errors.password ? "border-red-500" : "border-[#0B9343]"
            }`}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            className={`focus:outline-none w-full border-[2px] px-[12px] py-[3px] rounded-[12px] ${
              errors.repeat_password ? "border-red-500" : "border-[#0B9343]"
            }`}
            name="repeat_password"
            value={formData.repeat_password}
            onChange={handleChange}
            placeholder="Repeat Password"
            disabled={isLoading}
          />
          {errors.repeat_password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.repeat_password}
            </p>
          )}
        </div>

        {errors.submit && (
          <p className="text-red-500 text-sm text-center">{errors.submit}</p>
        )}

        <div className="w-full flex justify-end">
          <button
            type="submit"
            className={`bg-[#0B9343] hover:bg-[#087a34] px-[16px] py-[8px] rounded-[3px] text-white transition-colors duration-100 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </div>
      </form>
      <p>
        Already have an account?{" "}
        <Link href="/login" className="text-[#0B9343] hover:underline">
          Sign In
        </Link>
      </p>

      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          Registration successful! Redirecting...
        </div>
      )}
    </div>
  );
}
