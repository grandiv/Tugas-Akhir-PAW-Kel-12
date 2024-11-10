'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginCard() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        emailOrPhone: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevData => ({
            ...prevData,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // autentikasi
        router.push('/');
    };

    return (
        <div className="w-[360px] bg-white rounded-[8px] p-[24px] flex flex-col justify-between text-[#253D4E] shadow-lg">
            <h1 className="font-semibold text-[36px] text-center mb-6">Sign In</h1>
            <form className="flex flex-col gap-[16px]" onSubmit={handleSubmit}>
                
                {/* Email / No Handphone Field */}
                <div>
                    <label htmlFor="emailOrPhone" className="text-[#253D4E] text-sm font-medium">Email / No Handphone</label>
                    <input
                        type="text"
                        id="emailOrPhone"
                        name="emailOrPhone"
                        value={formData.emailOrPhone}
                        onChange={handleChange}
                        placeholder="Enter your email or phone number"
                        className="mt-1 focus:outline-none w-full border-[#0B9343] border-[2px] px-[12px] py-[8px] rounded-[12px] text-[#253D4E]"
                    />
                </div>

                {/* Password Field */}
                <div>
                    <label htmlFor="password" className="text-[#253D4E] text-sm font-medium">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="mt-1 focus:outline-none w-full border-[#0B9343] border-[2px] px-[12px] py-[8px] rounded-[12px] text-[#253D4E]"
                    />
                </div>

                <div className="w-full flex justify-end">
                    <button type="submit" className="bg-[#0B9343] hover:bg-[#087a34] px-[16px] py-[8px] rounded-[3px] text-white transition-colors duration-100">
                        Sign In
                    </button>
                </div>
            </form>
            <p className="text-center mt-4 text-sm">
                Don’t have an account? <Link href="/register" className="text-[#0B9343] hover:underline">Sign Up</Link>
            </p>
        </div>
    );
}
