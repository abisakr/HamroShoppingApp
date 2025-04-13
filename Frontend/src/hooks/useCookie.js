// src/hooks/useCookie.js
import { useEffect, useState } from "react";

const getCookie = (name) => {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};

const useCookie = (cookieName, intervalMs = 1000) => {
  const [cookieValue, setCookieValue] = useState(() => getCookie(cookieName));

  useEffect(() => {
    const interval = setInterval(() => {
      const currentValue = getCookie(cookieName);
      if (currentValue !== cookieValue) {
        setCookieValue(currentValue);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [cookieValue, cookieName, intervalMs]);

  return cookieValue;
};

export default useCookie;
