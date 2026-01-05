/**
 * Content Configuration
 * Static content used across components
 */

import { MapPin, User, Compass, Award } from 'lucide-react';

/**
 * Quest Info feature cards content
 */
export const QUEST_FEATURES = [
    {
        iconName: 'MapPin',
        title: "You're Never Lost",
        description: "Integrated maps that guide you with key insights along the way"
    },
    {
        iconName: 'User',
        title: "Curated by Local Experts",
        description: "Every location and information is sourced by locals and travel influencers"
    },
    {
        iconName: 'Compass',
        title: "Different not Popular",
        description: "We differentiate meaningful from popular so you travel without missing experiences"
    },
    {
        iconName: 'Award',
        title: "There's levels to it",
        description: "Complete fun milestones and get points as you engage with the community"
    }
];

/**
 * Icon mapping for feature cards
 */
export const FEATURE_ICONS = {
    MapPin,
    User,
    Compass,
    Award,
};
