import React from 'react';
import seekkrrLogo from '../../assets/homepage/seekkrr_logo.svg';
import appStoreGooglePlay from '../../assets/homepage/appstore_googleplay_logo.svg';
import backgroundVideo from '../../assets/homepage/background_video.mp4';

const Hero = () => {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full z-0">
                <div className="absolute inset-0 bg-black/30 z-10"></div> {/* Overlay for text readability if needed */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"> {/* object-cover ensures it covers without distortion */}
                    <source src={backgroundVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center">
                {/* Center Logo - 1.5x size (w-96 is 24rem, 1.5x is 36rem) */}
                <img src={seekkrrLogo} alt="SeekKrr" className="w-[24rem] md:w-[36rem] mb-8" />

                {/* Main Text - Decreased by 2 units (approx). text-4xl (36px) -> text-[34px] or text-3xl (30px). 
                    Let's use strict text-[34px] to respect "2 units" request if unit=pixel, or text-4xl was 36, so 34. 
                    Or if unit=tailwind, 3xl is safe. User said "decrease ... by 2 units". 
                    Let's try text-[32px] MD. */}
                <p className="text-2xl md:text-[32px] mb-8 max-w-3xl mx-auto font-inter font-medium text-[#F6F5F4]">
                    Take on <span className="font-bold">Quests</span> to the best kept Offbeat Experiences
                </p>

                <div className="flex flex-col items-center">
                    {/* Launching Text - Increased by 2 units. text-lg (18px) -> text-xl (20px) */}
                    <p className="text-xl font-inter font-semibold text-[#000000] mb-4">Launching Soon on</p>

                    {/* Store Icons - Increased width by 2 units. 
                        Usually height controls width. h-12 (48px) -> h-14 (56px) or h-[3.5rem]. 
                        Let's bump to h-14. */}
                    <div className="flex justify-center">
                        <img src={appStoreGooglePlay} alt="Get it on Google Play and App Store" className="h-10 md:h-14" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
