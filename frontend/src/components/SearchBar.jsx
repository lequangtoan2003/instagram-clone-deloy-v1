import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash/debounce"; // Import debounce
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Search } from "lucide-react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const searchUsers = debounce(async (searchQuery) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }
    try {
      const response = await axios.get(
        `https://instagram-clone-deloy-v1.onrender.com/api/v1/user/search?q=${searchQuery}`,
        { withCredentials: true }
      );
      console.log("Search response:", response.data);
      setResults(response.data.users);
      setShowResults(true);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  }, 300);

  useEffect(() => {
    if (query) {
      searchUsers(query);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query]);

  const handleInputClick = () => {};

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    setShowResults(false);
    setQuery("");
  };

  return (
    <div className="search-container">
      <div className="relative w-full">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClick={handleInputClick}
          className="w-full bg-gray-100 pl-10 pr-4 py-2 border rounded-md focus:outline-none"
        />
      </div>
      {showResults && results.length > 0 && (
        <ul className="search-results-dropdown">
          {results.map((user) => (
            <Link
              className="flex flex-col gap-2"
              key={user._id}
              onClick={() => handleUserClick(user._id)}
            >
              <div className="flex gap-2 items-center p-2 hover:bg-gray-100">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    className=" object-cover"
                    src={user?.profilePicture}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span>{user.username}</span>
              </div>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
