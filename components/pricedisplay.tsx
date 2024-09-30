import React from "react";

const PriceDisplay = ({ price }: { price: number }) => {
  return (
    <div className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        x="0px"
        y="0px"
        className="w-6"
      >
        <g data-name="14-Rupiah">
          <path d="M50,5A45,45,0,1,0,95,50,45.05,45.05,0,0,0,50,5Zm0,86A41,41,0,1,1,91,50,41,41,0,0,1,50,91Z" />
          <path d="M50.66,41.62A10.12,10.12,0,0,0,40.55,31.51H32.8A4.47,4.47,0,0,0,28.33,36V63.54a2,2,0,1,0,4,0V51.72h7.06L46.4,64a2,2,0,0,0,1.74,1,2,2,0,0,0,1-.26A2,2,0,0,0,49.87,62L43.7,51.21A10.11,10.11,0,0,0,50.66,41.62Zm-10.11,6.1H32.33V36a.46.46,0,0,1,.47-.46h7.75a6.11,6.11,0,1,1,0,12.21Z" />
          <path d="M63.83,45.39a9.25,9.25,0,0,0-5.9,2.18v-1a2,2,0,0,0-4,0V77.33a2,2,0,0,0,4,0V65.16a9.25,9.25,0,0,0,5.9,2.18c5.46,0,9.9-4.92,9.9-11S69.29,45.39,63.83,45.39Zm0,18c-3.25,0-5.9-3.13-5.9-7s2.65-7,5.9-7,5.9,3.13,5.9,7S67.08,63.34,63.83,63.34Z" />
        </g>
      </svg>
      <span className="text-lg font-medium">
        {" "}
        {price.toLocaleString("id-ID", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
      </span>
    </div>
  );
};

export default PriceDisplay;
