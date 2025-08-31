import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Shield, User, Home, PlusCircle, MessageCircle, Smartphone, Zap, Settings } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-black text-gray-100 p-6 flex flex-col items-center">
      <div className="max-w-5xl w-full">
        {/* Header / Hero Section */}
        <div className="flex flex-col items-center gap-6 text-center py-12">
            <div className="w-30 h-30">

          <motion.img
            src="https://pathwayactivities.co.uk/wp-content/uploads/2016/04/Profile_avatar_placeholder_large-circle-300x300.png"
            alt="Profile"
            className="w-full h-full rounded-full border-4 border-indigo-500 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            />
            </div>
          <h1 className="text-4xl font-bold">👋 Hi, I’m Gaurav Chauhan</h1>
          <p className="text-lg max-w-2xl leading-relaxed text-gray-300">
            I’m a passionate <span className="font-semibold text-indigo-400">Web Developer</span> who built 
            <span className="font-semibold text-indigo-400"> Snapgram</span> — a modern Instagram-inspired 
            social media platform for creators and users who want a seamless, fast, and responsive photo-sharing experience.
          </p>
          <div className="flex gap-4 mt-3">
            <a href="https://github.com/" target="_blank" rel="noreferrer">
              <Github className="w-6 h-6 hover:text-indigo-400 transition" />
            </a>
            <a href="https://linkedin.com/" target="_blank" rel="noreferrer">
              <Linkedin className="w-6 h-6 hover:text-indigo-400 transition" />
            </a>
            <a href="mailto:your@email.com">
              <Mail className="w-6 h-6 hover:text-indigo-400 transition" />
            </a>
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-8">🚀 Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Shield, title: "Google OAuth Authentication", desc: "Secure sign-in and sign-out powered by Appwrite’s integrated OAuth support." },
              { icon: User, title: "User Profiles", desc: "Each user has a profile with Username, Name, Bio, Posts, Followers, Following, and Avatar." },
              { icon: Home, title: "Home Feed", desc: "View all posts from all users in real-time." },
              { icon: PlusCircle, title: "Create Post", desc: "Upload posts with auto-generated IDs and timestamps." },
              { icon: MessageCircle, title: "Social Media Functionality", desc: "Interact, post, and engage with users across the platform." },
              { icon: Smartphone, title: "Fully Responsive UI", desc: "Smooth experience on mobile, tablet, and desktop." },
              { icon: Zap, title: "Fast & Scalable", desc: "Optimized state management and API integration for performance." },
              { icon: Settings, title: "Settings Panel", desc: "Update your profile, name, username, and bio easily." },
            ].map(({ icon: Icon, title, desc }, idx) => (
              <motion.div
                key={idx}
                className="bg-neutral-900 rounded-xl p-6 shadow-md border border-neutral-800"
                whileHover={{ scale: 1.03 }}
              >
                <Icon className="w-8 h-8 text-indigo-400 mb-3" />
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-gray-400 mt-2">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-6">🛠️ Tech Stack</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "React.js",
              "React Router DOM",
              "Appwrite (Database, Auth, Storage)",
              "Google OAuth",
              "Tailwind CSS",
              "React Context API",
              "Hosting: Vercel"
            ].map((tech, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
