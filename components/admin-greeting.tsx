import React from "react";

import { IUser } from "@/lib/models/User";

const AdminGreeting: React.FC<{ userInfo?: IUser | null }> = ({ userInfo }) => {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);

  const encouragingMessage = "Let's make today amazing!";

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        {userInfo ? `Hello, ${userInfo.username}!` : `Hello, Admin!`}
      </h1>
      <p className="text-xl mb-2 text-gray-700 dark:text-gray-200">
        Today is {formattedDate}
      </p>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        {encouragingMessage}
      </p>
    </div>
  );
};

export default AdminGreeting;
