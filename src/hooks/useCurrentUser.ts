import { useEffect, useState } from "react";

export function useCurrentUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error parsing user from localStorage", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading };
}
