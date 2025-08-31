import { useEffect } from "react";
import { FaLinkedinIn } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";
import { TbFileCv } from "react-icons/tb";
import Aos from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Shield,
  User,
  Home,
  PlusCircle,
  MessageCircle,
  Smartphone,
  Zap,
  Settings,
  Search,
  LanguagesIcon,
  Edit,
} from "lucide-react";

  export default function About() {
  useEffect(() => {
    Aos.init({
      duration: 1500,
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6 flex flex-col items-center">
      <div className="max-w-5xl w-full">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-6 text-center py-12">
          <div className="w-30 h-30 transition transform hover:scale-105">
            <motion.img
              src="https://pathwayactivities.co.uk/wp-content/uploads/2016/04/Profile_avatar_placeholder_large-circle-300x300.png"
              alt="Profile"
              className="w-full h-full rounded-full border-4 border-indigo-500 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>
          <h1 className="text-4xl font-bold">
            👋 Hi, I’m Gaurav Singh Chauhan
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed text-gray-300">
            I’m a passionate{" "}
            <span className="font-semibold text-indigo-400">Web Developer</span>{" "}
            who built
            <span className="font-semibold text-indigo-400"> Snapgram</span> — a
            modern Instagram-inspired social media platform for creators and
            users who want a seamless, fast, and responsive photo-sharing
            experience.
          </p>
          <div className="flex gap-4 mt-3">
            <a
              href="https://github.com/gauravchauhan25/Snapgram/"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="w-6 h-6 hover:text-indigo-400 transition" />
            </a>
            <a href="https://linkedin.com/" target="_blank" rel="noreferrer">
              <Linkedin className="w-6 h-6 hover:text-indigo-400 transition" />
            </a>
            <a href="mailto:gkumarc121@email.com">
              <Mail className="w-6 h-6 hover:text-indigo-400 transition" />
            </a>
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-12">
          <motion.h2
            className="text-3xl font-bold text-center mb-8"
            data-aos="fade-up"
          >
            🚀 Features
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Shield,
                title: "Google OAuth Authentication",
                desc: "Secure sign-in and sign-out powered by Appwrite’s integrated OAuth support.",
              },
              {
                icon: User,
                title: "User Profiles",
                desc: "Each user has a profile with Username, Name, Bio, Posts, Followers, Following, and Avatar.",
              },
              {
                icon: Home,
                title: "Home Feed",
                desc: "View all posts from all users in real-time.",
              },
              {
                icon: PlusCircle,
                title: "Create Post",
                desc: "Upload posts with auto-generated IDs and timestamps.",
              },
              {
                icon: Edit,
                title: "Edit and Delete Post",
                desc: "Edit post's captions and location easily.",
              },
              {
                icon: Settings,
                title: "Settings Panel",
                desc: "Update your profile, name, username, and bio easily.",
              },
              {
                icon: Search,
                title: "Search",
                desc: "A search feature to discover people and posts by tags or usernames.",
              },
              {
                icon: MessageCircle,
                title: "Social Media Functionality",
                desc: "Interact, post, and engage with users across the platform.",
              },
              {
                icon: Smartphone,
                title: "Fully Responsive UI",
                desc: "Smooth experience on mobile, tablet, and desktop.",
              },
              {
                icon: Zap,
                title: "Fast & Scalable",
                desc: "Optimized state management and API integration for performance.",
              },
            ].map(({ icon: Icon, title, desc }, idx) => (
              <motion.div
                key={idx}
                className="bg-neutral-900 rounded-xl p-6 shadow-md border border-neutral-800"
                whileHover={{ scale: 1.03 }}
                data-aos="flip-up"
              >
                <Icon className="w-8 h-8 text-indigo-400 mb-3" />
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-gray-400 mt-2">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="mt-16 mb-10 text-center">
          <motion.h2 className="text-3xl font-bold mb-6" data-aos="fade-up">
            {" "}
            Tech Stack Used
          </motion.h2>
          <motion.div
            className="flex flex-wrap justify-center gap-3 "
            data-aos="fade-up"
          >
            {[
              "React JS",
              "React Router DOM",
              "Appwrite (Database, Auth, Storage)",
              "Google OAuth",
              "Tailwind CSS",
              "React Context API",
            ].map((tech, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium transition transform active:scale-95 hover:scale-105"
              >
                {tech}
              </span>
            ))}
          </motion.div>
        </section>

        {/* Upcoiming Features Section */}
        <section className="mt-16 mb-10">
          <h2
            className="text-3xl font-bold mb-6 text-center"
            data-aos="fade-up"
          >
            🛠️ Upcoming Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: MessageCircle,
                title: "Real Time Direct Messaging",
                desc: "A direct messaging system between users (under development).",
              },
              {
                icon: LanguagesIcon,
                title: "Multi-language Support",
                desc: "Users from across the world will be able to use the app in different languages.",
              },
              {
                icon: Zap,
                title: "Improved Security & Rate Limiting",
                desc: "Providing more security to user such as Forgot Password and Email Notifications",
              },
              {
                icon: User,
                title: "Follow and Unfollow Feature",
                desc: "Follow or unfollow users and see who follows you..",
              },
            ].map(({ icon: Icon, title, desc }, idx) => (
              <motion.div
                key={idx}
                className="bg-neutral-900 rounded-xl p-6 shadow-md border border-neutral-800"
                whileHover={{ scale: 1.03 }}
                data-aos="flip-up"
              >
                <Icon className="w-8 h-8 text-indigo-400 mb-3" />
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-gray-400 mt-2">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <footer className="w-full h-auto mt-10">
        <div className="w-full h-20 p-1 flex justify-between items-center">
          <h3 className="w-48 md:w-56 text-sm md:text-[16px]">
            Made with React Js, Tailwind & Framer Motion
          </h3>
          <div className="flex justify-evenly items-center gap-5 md:gap-8 text-3xl">
            <motion.a
              href="https://www.linkedin.com/in/gaurav-chauhan-18102a2b8?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              target="_blank"
              className="hover:scale-110"
            >
              <FaLinkedinIn />
            </motion.a>
            <a
              href="https://github.com/gauravchauhan25/"
              target="_blank"
              className="hover:scale-110"
            >
              <FaGithub />
            </a>

            <a href="" target="_blank" className="hover:scale-110">
              <TbFileCv />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
