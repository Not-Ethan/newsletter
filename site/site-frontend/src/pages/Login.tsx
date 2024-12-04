import React, { useState } from "react";

const MagicLinkLogin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setResponseMessage("Magic link sent! Please check your email.");
        setIsSuccess(true);
      } else {
        setResponseMessage("Something went wrong. Please try again.");
        setIsSuccess(false);
      }
    } catch (error) {
      setResponseMessage("Network error. Please try again.");
      setIsSuccess(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100" style={{
      backgroundImage: `url('https://www.heropatterns.com/static/patterns/jigsaw.svg')`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    }}>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-2xl font-bold text-gray-700 text-center mb-4">
          Magic Link Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-600 text-sm font-medium"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Send Magic Link
          </button>
        </form>
        {responseMessage && (
          <div
            className={`mt-4 text-center text-sm ${
              isSuccess ? "text-green-500" : "text-red-500"
            }`}
          >
            {responseMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default MagicLinkLogin;
