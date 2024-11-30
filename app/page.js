"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true); // Trigger page load animation
  }, []);

  const handleCreateAccount = () => {
    router.push("/signup"); // Redirect to the sign-up page
  };

  const handleSignIn = () => {
    router.push("/signin"); // Redirect to the sign-in page
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 flex flex-col transition-all duration-700 ease-in-out transform ${
        isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Section 1: Discover Your Next Favorite Book */}
      <section className="text-center py-20 px-5 bg-blue-600 text-white">
        <h1 className="text-5xl font-extrabold mb-6 animate-fade-in">
          Discover Your Next Favorite Book
        </h1>
        <p className="text-lg mb-8 animate-slide-up">
          Search through thousands of books, filter by genre, rating, and year. Find the perfect book for your next read.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex justify-center space-x-6 animate-bounce-on-hover">
          <button
            className="px-8 py-4 bg-blue-500 hover:bg-blue-700 text-white rounded-md transition duration-300 ease-in-out"
            onClick={handleSignIn}
          >
            Get Started
          </button>
          <button
            className="px-8 py-4 bg-green-500 hover:bg-green-700 text-white rounded-md transition duration-300 ease-in-out"
            onClick={handleCreateAccount}
          >
            Create Account
          </button>
        </div>
      </section>

      {/* Section 2: Explore Books */}
      <section className="text-center py-20 px-5 bg-white">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 animate-fade-in">
          Explore Books
        </h2>
        <p className="text-lg text-gray-600 mb-8 animate-slide-up">
          Browse through different categories and discover your next read.
        </p>

        {/* Genre Filters */}
        <div className="flex justify-center space-x-6">
          <button className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition animate-pulse">
            Fiction
          </button>
          <button className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition animate-pulse">
            Non-fiction
          </button>
          <button className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition animate-pulse">
            Mystery
          </button>
          <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-md transition animate-pulse">
            Fantasy
          </button>
        </div>
      </section>

      {/* Section 3: Join the Book Community */}
      <section className="text-center py-20 px-5 bg-gray-200">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4 animate-fade-in">
          Join the Book Community
        </h2>
        <p className="text-lg text-gray-600 mb-8 animate-slide-up">
          Create an account or sign in to track your favorite books and reviews.
        </p>
        <div className="flex justify-center space-x-6">
          <button
            className="px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white rounded-md transition duration-300 ease-in-out"
            onClick={handleCreateAccount}
          >
            Create Account
          </button>
          <button
            className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition duration-300 ease-in-out"
            onClick={handleSignIn}
          >
            Sign In
          </button>
        </div>
      </section>
    </div>
  );
}
