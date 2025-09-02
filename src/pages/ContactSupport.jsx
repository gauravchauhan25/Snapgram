import { useState } from "react";
import { Mail, Phone, MessageSquare } from "lucide-react";
import api from "../services/appwrite";
import toast from "react-hot-toast";

export default function ContactSupport() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const submit = await api.contactSupport(
        form.name,
        form.email,
        form.message
      );

      if (submit) {
        console.log("Form submitted:", form);
        setSubmitted(true);
      } else {
        toast.error("Error while submitting! Try again later!");
        setSubmitted(false);
      }
    } catch (error) {
      console.log("Error while submitting:", error);
      toast.error("Error while submitting! Try again later!");
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-neutral-900 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <MessageSquare className="text-blue-500" size={28} />
          Contact Support
        </h1>

        {submitted ? (
          <div className="text-center space-y-4 mt-10">
            <h2 className="text-xl font-semibold">🎉 Thank you!</h2>
            <p className="">
              Your message has been received. Our team will get back to you
              soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Message</label>
              <textarea
                name="message"
                value={form.message || ""}
                onChange={handleChange}
                placeholder="Describe your issue or question in detail (e.g., login problems, profile update issues, feedback)."
                required
                rows="5"
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg shadow-lg cursor-pointer"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}

        {/* Alternative Contact Options */}
        <div className="mt-8 border-t border-neutral-700 pt-2 space-y-3">
          <p className="text-sm  text-center">Or reach us directly:</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm">
            <a
              href="mailto:gkumarc41@gmail.com"
              className="flex items-center gap-2 hover:text-blue-400"
            >
              <Mail size={16} /> gkumarc41@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
