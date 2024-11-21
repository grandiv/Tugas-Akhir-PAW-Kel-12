import RegisterCard from '@/components/RegisterCard';
import React from 'react';

export default function RegisterPage(){
    return(
        <main className="min-h-screen min-w-full grid grid-cols-2 max-lg:grid-cols-1 " style={{ backgroundImage: `url('/homepage/background.png')` }}>
            <div className='flex items-start justify-center max-lg:order-last mt-8 lg:mt-20'>
                <RegisterCard/>
            </div>
            <div className='flex flex-col justify-center max-lg:text-center lg:h-screen z-1'>
                <h1 className="text-[94px] font-bold"><span className='text-white'>Ladang</span> <span className='text-[#0B9343]'>Lokal</span></h1>
            </div>
        </main>
    )
}
