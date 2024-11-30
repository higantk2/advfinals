"use client";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { FaStar, FaRegStar, FaUser } from "react-icons/fa";

export default function MainPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [userEmail, setUserEmail] = useState("");
  const db = getFirestore();
  const genres = ["All", "Fiction", "Non-fiction", "Mystery", "Fantasy", "Sci-Fi", "Biography"];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
        fetchUserRatings(user.uid);
        fetchUserFavorites(user.uid);
      } else {
        setUserEmail("");
        setUserRatings({});
        setFavorites([]);
      }
    });

    const fetchBooks = async () => {
      const querySnapshot = await getDocs(collection(db, "books"));
      const fetchedBooks = [];
      querySnapshot.forEach((doc) => {
        fetchedBooks.push(doc.data());
      });
      setBooks(fetchedBooks);
    };

    fetchBooks();

    return () => unsubscribe();
  }, []);

  const fetchUserRatings = async (userId) => {
    const ratingsQuery = query(
      collection(db, "ratings"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(ratingsQuery);
    const ratings = {};
    querySnapshot.forEach((doc) => {
      const ratingData = doc.data();
      ratings[ratingData.bookTitle] = { rating: ratingData.userRating, docId: doc.id };
    });
    setUserRatings(ratings);
  };

  const fetchUserFavorites = async (userId) => {
    const favoritesQuery = query(
      collection(db, "favorites"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(favoritesQuery);
    const favoriteBooks = [];
    querySnapshot.forEach((doc) => {
      favoriteBooks.push(doc.data().bookTitle);
    });
    setFavorites(favoriteBooks);
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.error("Error logging out: ", err.message);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleFilter = (e) => {
    setSelectedGenre(e.target.value);
  };

  const handleRatingChange = async (book, rating) => {
    setUserRatings((prevRatings) => ({
      ...prevRatings,
      [book.title]: { rating },
    }));

    try {
      const ratingsQuery = query(
        collection(db, "ratings"),
        where("bookTitle", "==", book.title),
        where("userId", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(ratingsQuery);

      if (querySnapshot.empty) {
        await addDoc(collection(db, "ratings"), {
          bookTitle: book.title,
          genre: book.genre,
          author: book.author,
          userRating: rating,
          userId: auth.currentUser.uid,
        });
        alert("You rated this book!");
      } else {
        alert("You have already rated this book!");
      }
    } catch (err) {
      console.error("Error adding rating: ", err.message);
    }
  };

  const handleRemoveRating = async (book) => {
    const userRating = userRatings[book.title];
    if (userRating) {
      try {
        await deleteDoc(doc(db, "ratings", userRating.docId));
        setUserRatings((prevRatings) => {
          const updatedRatings = { ...prevRatings };
          delete updatedRatings[book.title];
          return updatedRatings;
        });
        alert("Rating removed successfully!");
      } catch (err) {
        console.error("Error removing rating: ", err.message);
      }
    } else {
      alert("You haven't rated this book yet.");
    }
  };

  const addToFavorites = async (book) => {
    try {
      await addDoc(collection(db, "favorites"), {
        bookTitle: book.title,
        userId: auth.currentUser.uid,
      });
      setFavorites([...favorites, book.title]);
      alert("Added to Favorites!");
    } catch (err) {
      console.error("Error adding to favorites: ", err.message);
    }
  };

  const removeFromFavorites = async (book) => {
    try {
      const favoriteQuery = query(
        collection(db, "favorites"),
        where("bookTitle", "==", book.title),
        where("userId", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(favoriteQuery);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      setFavorites(favorites.filter((favorite) => favorite !== book.title));
      alert("Removed from Favorites!");
    } catch (err) {
      console.error("Error removing from favorites: ", err.message);
    }
  };

  const filterBooks = () => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery) ||
        book.author.toLowerCase().includes(searchQuery);
      const matchesGenre =
        selectedGenre === "All" || book.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-blue-100 flex flex-col items-center">
      {/* Removed animation from top section */}
      <section className="w-full p-6 bg-blue-600 text-white flex justify-between items-center shadow-md">
        <button
          onClick={handleLogOut}
          className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-md transition-all duration-300 ease-in-out"
        >
          Log Out
        </button>
        <h1 className="text-3xl font-semibold">Welcome to the Book App</h1>
        <div className="flex items-center space-x-2">
          <FaUser className="text-white" />
          <p className="text-sm">{userEmail}</p>
        </div>
      </section>

      <section className="text-center py-10 w-full max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search for a book or author..."
          className="px-4 py-2 w-full border rounded-md text-black mb-4 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedGenre}
          onChange={handleFilter}
          className="px-4 py-2 w-full border rounded-md text-black transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500"
        >
          {genres.map((genre, index) => (
            <option key={index} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </section>

      <section className="w-full px-6 py-6 bg-white shadow-lg rounded-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterBooks().map((book, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-md shadow-md hover:scale-105 transition-all duration-500 bg-gradient-to-r from-blue-50 to-white"
            >
              <h3 className="text-xl font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-700">{book.author}</p>
              <p className="text-sm text-gray-500">{book.genre}</p>

              <div className="flex items-center mt-4 mb-4">
                {[...Array(5)].map((_, starIndex) => (
                  <span
                    key={starIndex}
                    onClick={() => handleRatingChange(book, starIndex + 1)}
                    className={`cursor-pointer ${
                      starIndex < (userRatings[book.title]?.rating || 0)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    } text-2xl`} // Increased size for easier clicking
                  >
                    {starIndex < (userRatings[book.title]?.rating || 0)
                      ? <FaStar />
                      : <FaRegStar />}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center">
                {favorites.includes(book.title) ? (
                  <button
                    onClick={() => removeFromFavorites(book)}
                    className="text-red-600 hover:text-red-800 transition-colors duration-300 font-semibold py-2 px-4 rounded-md"
                  >
                    Remove from Favorites
                  </button>
                ) : (
                  <button
                    onClick={() => addToFavorites(book)}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-300 font-semibold py-2 px-4 rounded-md"
                  >
                    Add to Favorites
                  </button>
                )}
                {userRatings[book.title] && (
                  <button
                    onClick={() => handleRemoveRating(book)}
                    className="text-gray-600 hover:text-gray-800 transition-colors duration-300 font-semibold py-2 px-4 rounded-md"
                  >
                    Remove Rating
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
