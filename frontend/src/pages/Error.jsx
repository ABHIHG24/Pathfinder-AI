import React from "react";
import { Link, useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();
  console.log(error);

  if (error.status === 404) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center text-center bg-gray-50">
        <img
          src="https://cdn1.iconfinder.com/data/icons/photo-stickers-words/128/word_18-1024.png"
          alt="Not Found"
          className="w-64 h-64"
        />
        <h1 className="text-4xl font-bold text-gray-800 mt-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Sorry, the requested page could not be found.
        </p>
        <Link to="/" className="mt-6">
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Go Back Home
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center text-center bg-gray-50">
      <h1 className="text-4xl font-bold text-red-600">Something Went Wrong</h1>
    </div>
  );
};

export default Error;
