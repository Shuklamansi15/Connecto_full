import React from "react";
import logo1 from "../assets/logo1.png";
import { useNavigate } from "react-router-dom"; 

const Footer = () => {
    const navigate = useNavigate(); 
    
    // Define interactive links
    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
      
        <div className="md:mx-10">
          
            <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
                
                {/* left section (Company Info) */}
                <div>
                    <img
                        onClick={() => handleNavigation('/')}
                        className="w-40 h-10 object-cover object-center cursor-pointer"
                        src={logo1}
                        alt="Connecto Logo"
                    />
                    <p className="w-full md:w-2/3 text-gray-600 leading-6 mt-4">
                        Connecto is the premier platform for booking personalized, one-on-one consultation sessions with top social media influencers and industry experts. Unlock your growth potential today.
                    </p>
                </div>

                {/* center section (COMPANY Links) */}
                <div>
                    <p className="text-xl font-medium mb-5">COMPANY</p>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        <li 
                            className="cursor-pointer hover:text-[#1999d5] transition-colors"
                            onClick={() => handleNavigation('/')}>
                            Home
                        </li>
                        <li 
                            className="cursor-pointer hover:text-[#1999d5] transition-colors"
                            onClick={() => handleNavigation('/about')}>
                            About us
                        </li>
                        <li 
                            className="cursor-pointer hover:text-[#1999d5] transition-colors"
                            onClick={() => handleNavigation('/contact')}>
                            Contact us
                        </li>
                        <li 
                            className="cursor-pointer hover:text-[#1999d5] transition-colors"
                            onClick={() => handleNavigation('/privacy')}>
                            Privacy Policy
                        </li>
                        <li 
                            className="cursor-pointer hover:text-[#1999d5] transition-colors"
                            onClick={() => handleNavigation('/terms')}>
                            Terms of Service
                        </li>
                    </ul>
                </div>

                {/* right section (GET IN TOUCH) */}
                <div>
                    <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        {/* Note: In a real app, use mailto: and tel: links */}
                        <li className="hover:text-[#1999d5] transition-colors">
                            <a href="tel:+91 9899167518">
                                +91 9899167518
                            </a>
                        </li>
                        <li className="hover:text-[#1999d5] transition-colors">
                            <a href="mailto:support@connecto.co">
                                support@connecto.co
                            </a>
                        </li>
                        <li className="mt-4 text-sm text-gray-400">
                            Available Mon-Fri, 9am-5pm EST
                        </li>
                    </ul>
                </div>
            </div>

            {/* copyright text */}
            <div>
                <hr className="border-gray-200" />
                <p className="py-5 text-sm text-center text-gray-500">
                    Copyright 2025© Connecto - All Rights Reserved.
                </p>
            </div>
        </div>
    );
};

export default Footer;