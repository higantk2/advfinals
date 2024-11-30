"use client";
import { useState } from "react";
import { auth } from "../firebase"; // Adjust path if needed
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error
    setLoading(true); // Start loading animation

    // Password match validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false); // Stop loading animation
      return;
    }

    try {
      // Firebase create user
      await createUserWithEmailAndPassword(auth, email, password);
      // Redirect to sign-in page after successful account creation
      router.push("/signin");
    } catch (err) {
      setError("Failed to create an account: " + err.message);
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <section className="text-center py-20 px-5 bg-blue-600 text-white">
        <h1 className="text-5xl font-extrabold mb-6 animate-fade-in">
          Create an Account
        </h1>
        <form onSubmit={handleSignUp} className="space-y-6">
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
          <div className="mb-6">
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                <span>Creating Account...</span>
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        {error && <p className="text-black mt-4 animate-pulse">{error}</p>} {/* Updated to black */}

        {/* Redirect to Sign In with animation */}
        <div className="mt-4 animate-fade-in">
          <p className="text-white">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/signin")}
              className="cursor-pointer underline hover:text-gray-300 transition duration-300 ease-in-out"
            >
              Sign In
            </span>
          </p>
        </div>

        {/* Home Button */}
        <div className="mt-4 animate-fade-in">
          <button
            onClick={() => router.push("/")}
            className="px-8 py-4 bg-gray-500 hover:bg-gray-700 text-white rounded-md transition duration-300 ease-in-out"
          >
            Go to Home
          </button>
        </div>
      </section>
    </div>
  );
}
