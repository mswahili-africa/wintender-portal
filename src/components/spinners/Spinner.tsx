import React from 'react';

const Spinner = ({ size = "md" }) => {
  const spinnerSize = size === "sm" ? "w-6 h-6" : size === "lg" ? "w-12 h-12" : "w-8 h-8";

  return (
      <div className="flex justify-center items-center">
          <div
              className={`${spinnerSize} border-4 border-t-4 border-green-200 rounded-full animate-spin`}
              style={{ borderTopColor: 'green' }}
          ></div>
      </div>
  );
};

export default Spinner;
