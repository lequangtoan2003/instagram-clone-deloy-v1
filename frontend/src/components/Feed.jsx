import React, { useRef, useEffect } from "react";
import Posts from "./Posts";
import SearchBar from "./SearchBar";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchOpen } from "@/redux/searchSlice";

export default function Feed() {
  const { searchOpen } = useSelector((store) => store.search);
  const dispatch = useDispatch();
  const searchRef = useRef(null);

  useEffect(() => {
    if (!searchOpen) return;

    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !event.target.closest(".search-sidebar-item")
      ) {
        dispatch(setSearchOpen(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchOpen, dispatch]);

  return (
    <div className="flex-1 flex flex-col my-8 items-center pl-[20%] rounded-r-lg">
      {searchOpen && (
        <div
          ref={searchRef}
          className="z-10 fixed top-0 left-[16%] w-[20%] h-screen bg-white shadow-[8px_0_10px_rgba(0,0,0,0.09)] rounded-r-2xl border-r border-gray-300"
        >
          <X
            className="absolute top-2 right-2 cursor-pointer text-gray-600 hover:text-black"
            onClick={() => dispatch(setSearchOpen(false))}
          />
          <h1 className="font-semibold text-2xl p-7">Search</h1>
          <div className="p-2">
            <SearchBar />
          </div>
        </div>
      )}
      <Posts />
    </div>
  );
}
