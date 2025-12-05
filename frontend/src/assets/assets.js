// CORE ASSETS
import appointment_img from "./appointment_img.png";
import header_img from "./header_img.png";
import group_profiles from "./group_profiles.png";
import profile_pic from "./profile_pic.png";
import contact_image from "./contact_image.png";
import about_image from "./about_image.png";
import influencer_img from "./influencer_img.png" // Main banner image
import logo1 from "./logo1.png";

// ICON ASSETS
import dropdown_icon from "./dropdown_icon.svg";
import menu_icon from "./menu_icon.svg";
import search_icon from  "./search_icon.png"
import cross_icon from "./cross_icon.png";
import chats_icon from "./chats_icon.svg";
import verified_icon from "./verified_icon.svg";
import arrow_icon from "./arrow_icon.svg";
import info_icon from "./info_icon.svg";
import upload_icon from "./upload_icon.png";
import stripe_logo from "./stripe_logo.png";
import razorpay_logo from "./razorpay_logo.png";
import facebook from "./facebook.png";
import tiktok from "./tiktok.png";
import twitter from "./twitter.png";
import youtube from "./youtube.png";
import snapchat from "./snapchat.png";
import instagram from "./instagram.png";
// INFLUENCER PROFILE IMAGES
import inf1 from "./inf1.png";
import inf2 from "./inf2.png"
import inf3 from "./inf3.png"
import inf4 from "./inf4.png"
import inf5 from "./inf5.png"
import inf6 from "./inf6.png"
import inf7 from "./inf7.png"
import inf8 from "./inf8.png"
import inf9 from "./inf9.png" 
import inf10 from "./inf10.png" 
import inf11 from "./inf11.png"; 

// INFLUENCER CATEGORY ICONS
import Gaming from "./Gaming.png";
import tech from "./tech.png";
import fashion from "./fashion.png";
import fitness from "./fitness.png";
import finance from "./finance.png";
import art from "./art.png";
// FIX: Added new category images for diversity
import cooking from "./cooking.png";
import travel from "./travel.png";

export const assets = {
  appointment_img,
  header_img,
  influencer_img,
  inf1,
  group_profiles,
  logo1,
  chats_icon,
  verified_icon,
  info_icon,
  profile_pic,
  arrow_icon,
  search_icon,
  contact_image,
  about_image,
  menu_icon,
  cross_icon,
  dropdown_icon,
  upload_icon,
  stripe_logo,
  razorpay_logo,
  facebook,
  tiktok,
  instagram,
  youtube,
  twitter,
  snapchat,

  // Influencer Profile Images
  inf2, inf3, inf4, inf5, inf6, inf7, inf8, inf9, inf10, inf11,

  // Category Icons
  Gaming, 
  tech, 
  fashion, 
  fitness, 
  finance, 
  art, 
  // FIX: Added new assets
  cooking,
  travel,
};

// Data for influencer categories (Added Food & Travel)
export const categoryData = [
  {
    category: "Gaming",
    image: Gaming,
  },
  {
    category: "Fashion",
    image: fashion,
  },
  {
    category: "Tech ",
    image: tech,
  },
  {
    category: "Fitness",
    image: fitness,
  },
  {
    category: "Finance ",
    image: finance,
  },
  {
    category: "Art ",
    image: art,
  },
  // FIX: Added new categories
  {
    category: "Food ",
    image: cooking,
  },
  {
    category: "Travel ",
    image: travel,
  },
];

// Data for individual influencers (FIXED and Updated)
export const influencers = [
  {
    _id: "inf1",
    name: "The Retro Gamer",
    image: inf1, 
    category: "Gaming",
    platform: "Twitch",
    followers: "1.2M+", 
    about:
      "Specialist in classic console games and speedrunning. Offers strategy sessions and retro game commentary.",
    rate: 150, 
    contact: {
      city: "Austin",
      country: "USA",
    },
  },
  {
    _id: "inf2",
    name: "Gadget Whisperer (Leo)",
    image: inf2, 
    category: "Tech ",
    platform: "Twitter/X",
    followers: "2.1M+", 
    about:
      "A seasoned tech journalist known for breaking news, exclusive leaks, and concise hardware reviews.",
    rate: 200, 
    contact: {
      city: "Seattle",
      country: "USA",
    },
  },
  {
    _id: "inf3", // FIX: Changed ID to inf3
    name: "Styled By Liv",
    image: inf3,
    category: "Fashion",
    platform: "Instagram",
    followers: "1.9M+", 
    about:
      "Curator of affordable, classic fashion and sustainable style. Known for 'get the look for less' segments.",
    rate: 180, 
    contact: {
      city: "London",
      country: "UK",
    },
  },
  {
    _id: "inf4",
    name: "Midnight Marauder",
    image: inf4,
    category: "Gaming",
    platform: "Twitch",
    followers: "650K+", 
    about:
      "Pro streamer and analyst specializing in competitive FPS games. Offers strategy breakdowns and live gameplay.",
    rate: 110, 
    contact: {
      city: "Atlanta",
      country: "USA",
    },
  },
  {
    _id: "inf5",
    name: "Molly's Money Moves",
    image: inf5,
    category: "Finance ",
    platform: "YouTube",
    followers: "950K+", 
    about:
      "Simplifying investing and retirement strategies for millennials. Focuses on index funds and smart budgeting.",
    rate: 250, 
    contact: {
      city: "New York",
      country: "USA",
    },
  },
  {
    _id: "inf6",
    name: "Digital Doodle (Kate)",
    image: inf6,
    category: "Art ",
    platform: "TikTok",
    followers: "9.1M+", 
    about:
      "Viral digital artist creating intricate time-lapses, tutorials, and challenges using Procreate and Photoshop.",
    rate: 90,
    contact: {
      city: "Vancouver",
      country: "Canada",
    },
  },
  {
    _id: "inf7",
    name: "The Iron Trainer",
    image: inf7,
    category: "Fitness",
    platform: "Instagram",
    followers: "580K+",
    about:
      "Certified strength coach. Specializes in functional training, HIIT workouts, and macro-based meal prep guides.",
    rate: 140,
    contact: {
      city: "Miami",
      country: "USA",
    },
  },
  {
    _id: "inf8",
    name: "Chef Ravi",
    image: inf8,
    category: "Food ", // FIX: Changed category to Food 
    platform: "Instagram",
    followers: "3.2M+",
    about:
      "Award-winning chef sharing regional Indian and modern fusion recipes with easy-to-find ingredients.",
    rate: 190,
    contact: {
      city: "Mumbai",
      country: "India",
    },
  },
  {
    _id: "inf9",
    name: "Wanderlust With Leo",
    image: inf9,
    category: "Travel ", // FIX: Changed category to Travel 
    platform: "YouTube",
    followers: "1.5M+",
    about:
      "Adventure documentary filmmaker and solo traveler. Focuses on off-the-grid destinations and cultural immersion.",
    rate: 200,
    contact: {
      city: "Base: Lisbon",
      country: "Portugal",
    },
  },
  {
    _id: "inf10",
    name: "Pixel Perfect Reviews",
    image: inf10,
    category: "Tech ", // FIX: Changed category to Tech  (was Family & Kids)
    platform: "YouTube",
    followers: "4.8M+", 
    about:
      "A leading tech channel focusing on deep-dive gadget reviews, software tutorials, and future tech analysis.",
    rate: 220, 
    contact: {
      city: "San Francisco",
      country: "USA",
    },
  },
  {
    _id: "inf11",
    name: "Glam Goddess Chloe",
    image: inf11,
    category: "Fashion",
    platform: "TikTok",
    followers: "3.9M+",
    about:
      "High-energy content creator specializing in makeup hacks, product dupes, and fast fashion lookbooks.",
    rate: 130,
    contact: {
      city: "Miami",
      country: "USA",
    },
  },
];