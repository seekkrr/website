import React, { useState, useEffect } from 'react';
import titleSvg from '../assets/contactUs/title.svg';
import { getApiUrl } from '../config';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    // Session tracking key
    const SESSION_KEY = 'seekkrr_contact_submitted';

    useEffect(() => {
        // Check if already submitted in this session
        if (sessionStorage.getItem(SESSION_KEY) === 'true') {
            setIsSuccess(true);
        }
    }, []);

    // Basic email regex: text + @ + domain
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
        const { name, email, message } = formData;
        const isValid =
            name.trim().length > 0 &&
            message.trim().length > 0 &&
            emailRegex.test(email);

        setIsFormValid(isValid);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        setIsSubmitting(true);

        try {
            // "imp. the backend route is api.seekkrr.com/api/queries"
            // Assuming it accepts JSON. Since it addresses "api.seekkrr.com", I should probably use the full URL 
            // or if there is a proxy setup. Given no info on proxy, I'll use full URL.
            // However, usually local dev might need a proxy or CORS might be an issue. 
            // I'll try fetch directly.
            const response = await fetch(getApiUrl('QUERIES'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsSuccess(true);
                sessionStorage.setItem(SESSION_KEY, 'true');
            } else {
                console.error('Failed to submit form');
                // Optional: handle error state, but instructions just said "display the message as per design" on success.
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#EBEAEC] min-h-screen pt-32 pb-10 flex flex-col font-inter overflow-x-hidden">
            {/* Header Section */}
            <div className="w-full flex flex-col items-center text-center mb-12 relative px-6">
                <div className="z-10">
                    <img src={titleSvg} alt="CONTACT US" className="h-10 md:h-14 lg:h-20 w-auto" />
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center px-6 lg:px-20">

                {/* Left Side: Text */}
                <div className="flex flex-col text-left space-y-2">
                    <h2 className="text-4xl md:text-5xl lg:text-5xl font-serif tracking-wide text-[#1C1C1E] leading-relaxed drop-shadow-sm opacity-90">
                        <span className="block mb-2">Questions,</span>
                        <span className="block mb-2">Suggestions,</span>
                        <span className="block mb-2">Exclusive Discounts</span>
                        <span className="block">and more!</span>
                    </h2>
                </div>

                {/* Right Side: Form Card */}
                <div className="bg-[#F6F4F3] rounded-[30px] p-8 md:p-12 shadow-sm w-full max-w-lg mx-auto lg:ml-auto">
                    {isSuccess ? (
                        <div className="h-full flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 animate-fade-in">
                            <h3 className="text-2xl md:text-3xl font-medium text-black leading-snug">
                                Thank you for reaching out, <br />
                                we will answer your query <br />
                                shortly
                            </h3>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-2xl font-light text-[#4A4A4A] mb-8">We’re here to help</h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Full Name */}
                                <div className="space-y-1">
                                    <label htmlFor="name" className="block text-sm font-semibold text-black">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className="w-full bg-transparent border-b border-gray-400 focus:border-black outline-none py-2 text-gray-700 placeholder-gray-400 transition-colors"
                                        required
                                    />
                                </div>

                                {/* Mobile (Optional) */}
                                <div className="space-y-1">
                                    <label htmlFor="mobile" className="block text-sm font-semibold text-black">
                                        Mobile (optional)
                                    </label>
                                    <input
                                        type="tel"
                                        id="mobile"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        placeholder="Enter your mobile number"
                                        className="w-full bg-transparent border-b border-gray-400 focus:border-black outline-none py-2 text-gray-700 placeholder-gray-400 transition-colors"
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-1">
                                    <label htmlFor="email" className="block text-sm font-semibold text-black">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        className="w-full bg-transparent border-b border-gray-400 focus:border-black outline-none py-2 text-gray-700 placeholder-gray-400 transition-colors"
                                        required
                                    />
                                </div>

                                {/* Message */}
                                <div className="space-y-1 pt-2">
                                    <label htmlFor="message" className="block text-sm font-semibold text-black mb-1">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell us more, ask questions"
                                        rows={4}
                                        className="w-full bg-transparent border border-black rounded-xl p-3 text-gray-700 placeholder-gray-400 outline-none resize-none"
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4 flex justify-center">
                                    <button
                                        type="submit"
                                        disabled={!isFormValid || isSubmitting}
                                        className={`px-12 py-3 rounded-full font-medium text-sm transition-all duration-300 ${isFormValid && !isSubmitting
                                            ? 'bg-black text-white hover:bg-gray-800 shadow-lg transform hover:-translate-y-0.5'
                                            : 'bg-[#D1D1D1] text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
