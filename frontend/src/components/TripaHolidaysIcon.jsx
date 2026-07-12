import React from 'react';

const TripaHolidaysIcon = ({ size, className = '',width, ...props }) => {
  return (
    <svg
      viewBox="0 0 320 240"
      width={width}
      height={size * 0.75} // Maintains the 4:3 aspect ratio
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="logo-content" width={`100%`}>
        {/* --- Airplane Graphic --- */}
        <g transform="translate(15, 25) rotate(-5)" id="airplane">
          {/* Main Body */}
          <path
            d="M 120 75 C 150 78, 165 95, 140 102 C 105 110, 50 115, 25 90 C 20 85, 10 65, 15 50 C 18 40, 25 45, 30 55 Z"
            fill="#8ac4f7"
            stroke="#0056b3"
            strokeWidth="2"
          />
          {/* Tail Fin */}
          <path
            d="M 22 62 L 5 15 C 2 8, 12 5, 18 15 L 42 52 Z"
            fill="#8ac4f7"
            stroke="#0056b3"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Front Wings */}
          <path
            d="M 65 85 L 30 145 C 25 153, 40 155, 55 145 L 110 95 Z"
            fill="#8ac4f7"
            stroke="#0056b3"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Back Wing */}
          <path
            d="M 72 75 L 60 25 C 58 20, 70 22, 78 32 L 95 76 Z"
            fill="#79b7ed"
            stroke="#0056b3"
            strokeWidth="1.5"
          />
          {/* Windows */}
          <path d="M 115 84 Q 122 86, 128 88" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <path d="M 134 90 Q 138 92, 142 94" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* --- Text Content --- */}
        {/* "Tripa" */}
        <text
          x="165"
          y="95"
          fontFamily="'Comic Sans MS', 'Arial Rounded MT Bold', sans-serif"
          fontSize="68"
          fontWeight="bold"
          fill="#0052cc"
          letterSpacing="1"
        >
          Tripa
        </text>

        {/* "Holidays" */}
        <text
          x="60"
          y="170"
          fontFamily="'Comic Sans MS', 'Arial Rounded MT Bold', sans-serif"
          fontSize="72"
          fontWeight="bold"
          fill="#000000"
          letterSpacing="0.5"
        >
          Holidays
        </text>

        {/* Tagline: "Discover The Difference" */}
        <text
          x="160"
          y="205"
          fontFamily="'Arial', 'Helvetica', sans-serif"
          fontSize="15"
          fontWeight="bold"
          fill="#444444"
          textAnchor="middle"
          letterSpacing="0.5"
        >
          Discover The Difference
        </text>
      </g>
    </svg>
  );
};

export default TripaHolidaysIcon;