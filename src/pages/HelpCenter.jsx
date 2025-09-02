import { useEffect, useState } from "react";
import { Search, Bug, Lightbulb, Mail, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const helpTopics = [
  {
    category: "Getting Started",
    items: [
      {
        q: "How do I sign up with Google OAuth?",
        a: "To sign up, click the “Sign in with Google” button on the login screen. You’ll be redirected to Google’s secure sign-in page, where you can select your Google account. Once authorized, Snapgram automatically creates your profile using your Google information. No separate password is required, making the process quick and secure. If you’re already signed in to Google on your device, it takes just one click. OAuth also ensures your data is protected, since Snapgram never stores your password directly.",
      },
      {
        q: "How to set up my profile?",
        a: "Go to Settings > Edit Profile. Here you can upload an avatar, edit your name, username, and bio. Your profile shows your posts, followers, and following counts. Keeping details updated helps other users find and connect with you.",
      },
      {
        q: "How to navigate the home feed?",
        a: "The home feed is where you’ll see posts from Snapgram users in real time. Simply scroll to view updates, photos, and captions. Posts are arranged chronologically or by date of upload. Each post shows the username, caption, tags, and timestamp. If you’re new, the feed is a great way to discover creators and trends. To refresh, pull down or reload the page, and new posts will appear instantly.",
      },
    ],
  },
  {
    category: "Posting & Sharing",
    items: [
      {
        q: "How do I create a post?",
        a: "Click the “Create Post” button on your dashboard. Upload a photo from your device, add a caption, and include relevant hashtags for better discovery. Each post automatically gets a unique ID and timestamp. Once published, it appears instantly in the home feed, where other users can like, comment, and engage with your content.",
      },
      {
        q: "How do timestamps work?",
        a: "Each time you publish a post, Snapgram automatically adds a timestamp showing the exact date and time of creation. This helps organize posts chronologically across the feed and profile pages. Timestamps also make it easy for users to track activity, discover recent content, and engage with posts while they’re fresh. You don’t need to set them manually.",
      },
    ],
  },
  {
    category: "Interacting on Snapgram",
    items: [
      {
        q: "How do I like or save posts?",
        a: "Click the heart icon to like or the save button to save (just for user experience but actually nothing is happening).",
      },
      {
        q: "How does search work?",
        a: "Use the search bar to find people by username.",
      },
    ],
  },
  {
    category: "Profile & Settings",
    items: [
      {
        q: "How do I update my info?",
        a: "Go to Settings > Edit Profile to edit name, bio, or username.",
      },
      {
        q: "Can I change my avatar?",
        a: "Yes, upload a new avatar from the Profile panel in the dashboard by clicking on the current profile avatar.",
      },
    ],
  },
  {
    category: "Support & Troubleshooting",
    items: [
      {
        q: "I can’t log in with Google",
        a: "Ensure you’re using the same Google account. If issues persist, clear cache and try again.",
      },
      {
        q: "Why won’t my post upload?",
        a: "Check your internet connection. Large files may fail if they exceed storage limits (avoid uploading files above 30mb).",
      },
    ],
  },
  {
    category: "Upcoming Features (Roadmap Help)",
    items: [
      {
        q: "How will direct messaging work?",
        a: "Snapgram is working on a direct messaging feature that will allow users to chat privately with one another. Once released, you’ll be able to send and receive text messages, share posts, and possibly media files directly within the app.",
      },
      {
        q: "How will followers/following work?",
        a: "A new follower system will let you follow your favorite creators and see their posts on your feed. You’ll also have a Following and Followers list on your profile, making it easy to track your community.",
      },
      {
        q: "Will Snapgram support multiple languages?",
        a: "Yes, Snapgram will soon support multiple languages so users across the world can browse the app in their preferred language. A language option will be added in the settings panel.",
      },
    ],
  },
  {
    category: "Community & Feedback",
    items: [
      {
        q: "How can I report a bug?",
        a: "Click the 'Report a Bug' button below to submit details.",
      },
      {
        q: "How can I request a feature?",
        a: "Use the 'Request a Feature' button to share your ideas.",
      },
    ],
  },
];

export default function HelpCenter() {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const navigate = useNavigate();
  const filteredTopics = helpTopics.map((topic) => ({
    ...topic,
    items: topic.items.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 px-3 py-6 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-4">
          <HelpCircle className="text-blue-500" size={28} />
          Help Center
        </h1>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search help topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Topics */}
        <div className="space-y-4">
          {filteredTopics.map(
            (topic, tIndex) =>
              topic.items.length > 0 && (
                <div
                  key={tIndex}
                  className="bg-neutral-900 rounded-xl shadow p-4"
                >
                  <h2 className="text-xl font-semibold mb-3">
                    {topic.category}
                  </h2>
                  <div className="space-y-2">
                    {topic.items.map((item, iIndex) => {
                      const index = `${tIndex}-${iIndex}`;
                      return (
                        <div key={index}>
                          <button
                            onClick={() =>
                              setOpenIndex(openIndex === index ? null : index)
                            }
                            className="w-full text-left flex justify-between items-center py-2 px-3 rounded-lg hover:bg-neutral-800"
                          >
                            <span>{item.q}</span>
                            <span>{openIndex === index ? "-" : "+"}</span>
                          </button>
                          {openIndex === index && (
                            <p className="mt-2 px-3 text-gray-400">{item.a}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
          )}
        </div>

        {/* Feedback Buttons */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-3 px-4 rounded-xl shadow-lg cursor-pointer"
            onClick={() => navigate("/report-bug")}
          >
            <Bug size={18} /> Report a Bug
          </button>
          <button
            className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black py-3 px-4 rounded-xl shadow-lg cursor-pointer"
            onClick={() => navigate("/request-feature")}
          >
            <Lightbulb size={18} /> Request a Feature
          </button>
          <button
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-3 px-4 rounded-xl shadow-lg cursor-pointer"
            onClick={() => navigate("/contact-support")}
          >
            <Mail size={18} /> Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
