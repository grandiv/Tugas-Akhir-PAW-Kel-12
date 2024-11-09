'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterCard(){
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        no_handphone: "",
        password : "",
        repeat_password: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push('/login')
    };

    return(
        <div className="w-[360px] h-[480px] bg-white rounded-[3px] p-[16px] flex flex-col justify-between text-[#253D4E]">
            <h1 className="font-semibold text-[48px] text-center">Sign Up</h1>
            <form className="flex flex-col gap-[12px]">
                <input type="text" className="focus:outline-none w-full border-[#0B9343] border-[2px] px-[12px] py-[3px] rounded-[12px]" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                />
                <input type="email" className="focus:outline-none w-full border-[#0B9343] border-[2px] px-[12px] py-[3px] rounded-[12px]" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                />
                <input type="text" className="focus:outline-none w-full border-[#0B9343] border-[2px] px-[12px] py-[3px] rounded-[12px]" 
                name="no_handphone"
                value={formData.no_handphone}
                placeholder="No Handphone"
                onChange={handleChange}
                />
                <input type="password" className="focus:outline-none w-full border-[#0B9343] border-[2px] px-[12px] py-[3px] rounded-[12px]" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                />
                <input type="password" className="focus:outline-none w-full border-[#0B9343] border-[2px] px-[12px] py-[3px] rounded-[12px]" 
                placeholder="Repeat Password"
                name="repeat_password"
                value={formData.repeat_password}
                onChange={handleChange}
                />
                <div className="w-full flex justify-end">
                    <button className="bg-[#0B9343] hover:bg-[#087a34] px-[16px] py-[8px] rounded-[3px] text-white transition-colors duration-100" onClick={handleSubmit}>Sign Up</button>
                </div>
            </form>
            <p>Already have an account? <Link href={'/login'}>Sign In</Link></p>
        </div>
    )
}