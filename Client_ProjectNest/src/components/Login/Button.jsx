import React from "react";
import { ClipLoader } from "react-spinners";
export function Button({ isLoading }) {
  return (
    <button
      className={`bg-blue-500 h-10 w-11/12 text-white rounded-lg border-none ${
        !isLoading && "hover:bg-blue-600"
      } flex items-center justify-center ${isLoading && "bg-blue-400"}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <ClipLoader size={24} color={"#fff"} speedMultiplier={0.8} />
      ) : (
        "Sign In"
      )}
    </button>
  );
}
