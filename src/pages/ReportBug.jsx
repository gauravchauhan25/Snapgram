import { useState } from "react";
import { Bug } from "lucide-react";
import api from "../services/appwrite";
import toast from "react-hot-toast";

export default function ReportBug() {
  const [form, setForm] = useState({ name: "", email: "", bug: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.bug) {
      toast.error("All fields are required!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    try {
      setLoading(true);
      const submit = await api.reportBugs(form.name, form.email, form.bug);

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
      <div className="max-w-2xl w-full bg-neutral-900 p-8 rounded-2xl shadow-lg px-3 py-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Bug className="text-red-500" size={28} />
          <h1 className="text-2xl md:text-3xl font-bold">Report a Bug</h1>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={form.name || ""}
                required
                placeholder="Your name"
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email || ""}
                required
                placeholder="you@example.com"
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Bug Description
              </label>
              <textarea
                name="bug"
                value={form.bug || ""}
                required
                rows="5"
                onChange={handleChange}
                placeholder="Describe the issue you found..."
                className="w-full px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 py-3 px-4 rounded-xl font-semibold shadow-lg cursor-pointer"
            >
              {loading ? "Submitting..." : "Submit Bug Report"}
            </button>
          </form>
        ) : (
          <div className="text-center py-12">
            <Bug className="text-red-500 mx-auto mb-4" size={40} />
            <h2 className="text-xl font-bold mb-2">Thank you!</h2>
            <p className="text-gray-400">
              Your bug report has been submitted. Our team will review it soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
