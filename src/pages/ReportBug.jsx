import { useState } from "react";
import { Bug } from "lucide-react";

export default function ReportBug() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-neutral-900 p-8 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Bug className="text-red-500" size={28} />
          <h1 className="text-2xl font-bold">Report a Bug</h1>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Name</label>
              <input
                type="text"
                required
                placeholder="Your name"
                className="w-full px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Email</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Bug Description</label>
              <textarea
                required
                rows="5"
                placeholder="Describe the issue you found..."
                className="w-full px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 py-3 px-4 rounded-xl font-semibold shadow-lg cursor-pointer"
            >
              Submit Bug Report
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
