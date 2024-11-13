"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FormError {
  emailOrPhone?: string;
  password?: string;
  submit?: string;
}

export default function LoginCard() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormError>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: FormError = {};
    if (!formData.emailOrPhone) {
      newErrors.emailOrPhone = "Email or phone number is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errors[e.target.name as keyof FormError]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: formData.emailOrPhone,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error instanceof Error ? error.message : "Login failed",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[360px] bg-white rounded-[8px] p-[24px] flex flex-col justify-between text-[#253D4E] shadow-lg">
      <h1 className="font-semibold text-[36px] text-center mb-6">Sign In</h1>
      <form className="flex flex-col gap-[16px]" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="emailOrPhone" className="text-sm font-medium">
            Email / No Handphone
          </label>
          <input
            type="text"
            id="emailOrPhone"
            name="emailOrPhone"
            value={formData.emailOrPhone}
            onChange={handleChange}
            placeholder="Enter your email or phone number"
            className={`mt-1 focus:outline-none w-full border-[2px] px-[12px] py-[8px] rounded-[12px] ${
              errors.emailOrPhone ? "border-red-500" : "border-[#0B9343]"
            }`}
            disabled={isLoading}
          />
          {errors.emailOrPhone && (
            <p className="text-red-500 text-xs mt-1">{errors.emailOrPhone}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className={`mt-1 focus:outline-none w-full border-[2px] px-[12px] py-[8px] rounded-[12px] ${
              errors.password ? "border-red-500" : "border-[#0B9343]"
            }`}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
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
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </form>

      <p className="text-center mt-4 text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-[#0B9343] hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
