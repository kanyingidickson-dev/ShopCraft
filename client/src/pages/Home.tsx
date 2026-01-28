import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Hero Section */}
            <div className="relative overflow-hidden pt-20 pb-40">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 blur-3xl -z-10 rounded-full opacity-60 animate-pulse"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full mb-8 border border-blue-100 animate-bounce">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <span className="text-xs font-black uppercase tracking-widest">
                                New Session Available
                            </span>
                        </div>

                        <h1 className="text-7xl md:text-8xl font-black text-[#0F172A] tracking-tighter mb-8 leading-[0.9]">
                            Curating the <br />
                            <span className="text-blue-600">Future</span> of Retail.
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-500 font-medium mb-12 max-w-3xl mx-auto leading-relaxed">
                            ShopCraft is not just a platform; it's a statement. Experience a
                            meticulously curated collection of premium products delivered with
                            uncompromising speed.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <Link
                                to="/products"
                                className="w-full sm:w-auto px-10 py-5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-black rounded-2xl shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-1 active:scale-95 text-lg tracking-tight"
                            >
                                EXPLORE COLLECTIONS
                            </Link>
                            <Link
                                to="/register"
                                className="w-full sm:w-auto px-10 py-5 bg-white hover:bg-gray-50 text-[#0F172A] font-black rounded-2xl shadow-xl border border-gray-100 hover:border-gray-200 transition-all transform hover:-translate-y-1 active:scale-95 text-lg tracking-tight"
                            >
                                START YOUR JOURNEY
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Section */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <FeatureCard
                        icon={
                            <svg
                                className="w-8 h-8 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                            </svg>
                        }
                        title="AUTHENTIC QUALITY"
                        description="Every item in our collection undergoes a rigorous multi-point inspection to ensure absolute perfection before it reaches your hands."
                        bgColor="bg-blue-100"
                    />

                    <FeatureCard
                        icon={
                            <svg
                                className="w-8 h-8 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                        }
                        title="PRIME DELIVERY"
                        description="With our global logistics network, we offer same-day processing and expedited global shipping, trackable in real-time."
                        bgColor="bg-purple-100"
                    />

                    <FeatureCard
                        icon={
                            <svg
                                className="w-8 h-8 text-pink-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        }
                        title="ELITE SECURITY"
                        description="Your data and transactions are protected by industry-leading end-to-end encryption and advanced fraud prevention systems."
                        bgColor="bg-pink-100"
                    />
                </div>
            </div>

            {/* Social Proof Section (Mock) */}
            <div className="bg-[#0F172A] py-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    <h2 className="text-white text-3xl font-black mb-12 tracking-tight opacity-40 uppercase">
                        Trusted by Industry Leaders
                    </h2>
                    <div className="flex flex-wrap justify-center gap-12 grayscale opacity-50">
                        {['VELOCITY', 'AURORA', 'ZENITH', 'NEXUS', 'QUANTUM'].map((brand) => (
                            <span
                                key={brand}
                                className="text-white text-2xl font-black tracking-widest"
                            >
                                {brand}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

type FeatureCardProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
    bgColor: string;
};

const FeatureCard = ({ icon, title, description, bgColor }: FeatureCardProps) => (
    <div className="group bg-white rounded-[2.5rem] p-10 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-50 flex flex-col items-start">
        <div
            className={`w-16 h-16 ${bgColor} rounded-2xl flex items-center justify-center mb-8 transform transition-transform group-hover:rotate-12 duration-300`}
        >
            {icon}
        </div>
        <h3 className="text-sm font-black text-[#0F172A] tracking-[0.2em] mb-4">{title}</h3>
        <p className="text-gray-500 font-medium leading-relaxed group-hover:text-gray-700 transition-colors">
            {description}
        </p>
    </div>
);

export default Home;
