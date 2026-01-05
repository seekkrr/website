import React from 'react';
import titleSvg from '../assets/mission/title.svg';
import trailSvg from '../assets/mission/trail.svg';
import iconSvg from '../assets/mission/icon.svg';

const Mission = () => {
    return (
        <div className="bg-[#EBEAEC] min-h-screen pt-40 pb-10 flex flex-col font-inter overflow-x-hidden">

            {/* Header Section */}
            <div className="w-full flex flex-col items-center text-center mb-0 relative px-6">
                {/* Title - Smaller Size (0.75x approx) */}
                <div className="mb-8 z-10">
                    <img src={titleSvg} alt="MISSION" className="h-8 md:h-12 lg:h-16 w-auto" />
                </div>

                {/* Subtitle */}
                <p className="text-[#1C1C1E] text-lg md:text-2xl font-normal max-w-3xl mx-auto mb-16 z-10 relative">
                    To replace the anxiety of the unknown with the thrill of discovery
                </p>

                {/* Trail - Full Width Background */}
                <div className="absolute top-20 left-0 w-full z-0 flex justify-center opacity-90 pointer-events-none">
                    <img src={trailSvg} alt="" className="w-full h-auto object-cover min-w-[1200px]" />
                </div>
            </div>

            {/* Main Content Section */}
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-12 relative z-10 px-6 lg:px-20 mt-12">
                {/* Text Content */}
                <div className="order-1 flex flex-col text-left">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#586B8F] mb-8 leading-tight">
                        <span className="block">You focus on Discovery,</span>
                        <span className="block whitespace-nowrap">we focus on Where, How & When</span>
                    </h2>
                    <p className="text-lg md:text-xl text-[#000000] leading-relaxed max-w-xl">
                        With every journey curated by local experts, and every destination gamified with a twist its culture, forget the worry of missing an experience, a local delicacy or a bus!
                    </p>
                </div>

                {/* Icon/Image Content - Larger & More Tilt */}
                <div className="order-2 flex justify-center lg:justify-end">
                    <img
                        src={iconSvg}
                        alt="Travel and Discovery"
                        className="w-full max-w-lg lg:max-w-2xl object-contain transform rotate-6 hover:rotate-[30deg] transition-transform duration-700 ease-in-out origin-bottom-right"
                    />
                </div>
            </div>

            {/* Vision Footer Section - Moved Up */}
            <div className="text-center max-w-5xl mx-auto mt-4 px-6 pb-8">
                <p className="text-lg md:text-2xl text-[#4A4A4A] font-light leading-relaxed">
                    Our <span className="font-bold text-black">Vision</span> is to bring Harmony between People and Culture, to create a world where no Traveler feels like an outsider
                </p>
            </div>
        </div>
    );
};

export default Mission;
