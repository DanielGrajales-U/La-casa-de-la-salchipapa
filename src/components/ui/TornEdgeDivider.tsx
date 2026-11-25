import React from 'react';

interface TornEdgeDividerProps {
  fillClass: string;
}

export const TornEdgeDivider: React.FC<TornEdgeDividerProps> = ({ fillClass }) => {
  return (
    <div
      aria-hidden="true"
      className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none"
    >
      <svg
        viewBox="0 0 1440 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-7 sm:h-10 ${fillClass}`}
        preserveAspectRatio="none"
      >
        <path
          d="M0 44V18L42 26L88 12L145 24L210 10L275 23L342 14L410 27L488 12L560 22L632 9L710 25L785 11L862 24L940 13L1018 27L1095 10L1172 22L1248 13L1325 26L1390 15L1440 22V44H0Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};
