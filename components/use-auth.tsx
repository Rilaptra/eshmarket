"use client";

import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    setIsLoggedIn(!!userInfo);
  }, []);

  return isLoggedIn;
};
