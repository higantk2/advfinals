"use client";
import { useState } from "react";
import { auth } from "../firebase"; // Ensure correct path to firebase.js
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error
    setLoading(true); // Start loading animation

    // Validate email format
    if (!email.includes("@")) {
      setError("Invalid email format. An '@' symbol is required.");
      setLoading(false); // Stop loading animation
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/main");
    } catch (err) {
      setError("Failed to sign in: " + err.message);
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  const handleRedirectToHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <section className="text-center py-20 px-5 bg-blue-600 text-white">
        <h1 className="text-5xl font-extrabold mb-6">Sign In</h1>
        <form onSubmit={handleSignIn} className="space-y-6">
          <div className="mb-6">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="transition-transform transform focus:scale-105 focus:ring-2 focus:ring-blue-400 px-4 py-3 w-72 border rounded-md text-black"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="transition-transform transform focus:scale-105 focus:ring-2 focus:ring-blue-400 px-4 py-3 w-72 border rounded-md text-black"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`relative px-8 py-4 bg-blue-500 hover:bg-blue-700 text-white rounded-md transition duration-300 ease-in-out ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Signing In...</span>
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Redirect Button */}
        <div className="mt-4">
          <button
            onClick={handleRedirectToHome}
            className="px-8 py-4 bg-gray-500 hover:bg-gray-700 text-white rounded-md transition duration-300 ease-in-out"
          >
            Back to Home
          </button>
        </div>
      </section>
    </div>
  );
}
