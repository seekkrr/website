import React from 'react';
import whatIsAQuest from '../../assets/homepage/what_is_a_quest.svg';
import quote from '../../assets/homepage/quote.svg';
import trail from '../../assets/homepage/trail.svg';
import { QUEST_FEATURES, FEATURE_ICONS } from '../../config';

const QuestInfo = () => {
    // Map features with their icon components
    const features = QUEST_FEATURES.map(feature => {
        const IconComponent = FEATURE_ICONS[feature.iconName];
        return {
            ...feature,
            icon: <IconComponent className="w-8 h-8 text-gray-800" />,
        };
    });

    return (
        <section className="relative py-20 pb-[40vw] bg-[#EBEAEC] overflow-hidden">
            {/* Trail Background */}
            <img
                src={trail}
                alt=""
                className="absolute top-0 left-1/2 -translate-x-1/2 min-w-[1280px] w-full h-auto max-w-none z-0 pointer-events-none opacity-80"
            />

            <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-4">

                {/* Left Text replaced with SVG */}
                <div>
                    <img src={whatIsAQuest} alt="What is a Quest?" className="w-full max-w-md mb-8" />

                    <p className="text-xl text-gray-700 leading-relaxed mb-8 font-inter">
                        A Quest is your Companion in Exploration - turning every Location into a Map of Hidden Gems
                    </p>
                </div>

                {/* Right Features */}
                <div className="space-y-8">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-start bg-white/50 p-4 rounded-xl shadow-sm backdrop-blur-sm">
                            <div className="bg-white p-3 rounded-full shadow-md mr-6 flex-shrink-0">
                                {feature.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#4A5568] mb-1 font-inter">{feature.title}</h3>
                                <p className="text-sm text-gray-600 font-inter">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-10 mt-20 flex justify-center">
                {/* Quote replaced with SVG */}
                <img src={quote} alt="See the world differently" className="w-full max-w-4xl" />
            </div>
        </section>
    );
};

export default QuestInfo;
