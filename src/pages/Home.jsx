import React from 'react';
import Hero from '../components/home/Hero';
import QuestInfo from '../components/home/QuestInfo';
import QuestTrail from '../components/home/QuestTrail';

const Home = () => {
    return (
        <div className="bg-[#EBEAEC]">
            <Hero />
            <QuestInfo />
            <QuestTrail />
            {/* Additional sections like 'How it works' visual map could be added here if needed */}
        </div>
    );
};

export default Home;
