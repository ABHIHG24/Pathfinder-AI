import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      {/* Spinner */}
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      {/* Text */}
      <h1 className="mt-5 text-xl font-bold text-gray-600">Loading . . .</h1>
    </div>
  );
};

export default Loading;
