import React from 'react';
import trail2 from '../../assets/homepage/trail2.svg';

const QuestTrail = () => {
    return (
        <section className="bg-[#EBEAEC] w-full overflow-hidden leading-none -mt-[20vw] relative z-20">
            <img
                src={trail2}
                alt=""
                className="w-full h-auto block min-w-[1280px] left-1/2 -translate-x-1/2 relative" // Keeping min-w to match the crop behavior if desired, or just w-full if strict "cover"
            />
        </section>
    );
};

export default QuestTrail;
