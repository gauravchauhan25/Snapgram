import { useState } from "react";
import { Lightbulb } from "lucide-react";
import api from "../services/appwrite";

export default function RequestFeature() {
  const [form, setForm] = useState({ name: "", email: "", feature: "" });
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
      const submit = await api.requestFeature(
        form.name,
        form.email,
        form.feature
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
    <div className="min-h-screen bg-neutral-950 text-[#fff] flex items-center justify-center p-3">
      <div className="max-w-2xl w-full bg-neutral-900 rounded-2xl shadow-xl px-3 py-5">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
          <Lightbulb className="text-yellow-400" size={28} />
          Request a New Feature
        </h1>

        {submitted ? (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">✨ Thank you!</h2>
            <p className="">
              We’ve received your feature request. Our team will review it and
              consider it for future updates.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Feature Request</label>
              <textarea
                name="feature"
                value={form.feature}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Describe the feature you’d like to see..."
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600  font-semibold py-3 rounded-lg shadow-lg cursor-pointer"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
