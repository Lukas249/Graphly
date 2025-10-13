"use client"

import { useEffect, useState } from "react";

export function useAsync<T>(promiseFn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ status: number, message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;

    promiseFn()
      .then((result) => isMounted && setData(result))
      .catch((err) => isMounted && setError(() => {
        if(err.status && err.message) {
          return {status: err.status, message: err.message}
        }

        return {status: 500, message: "Unknown error"}
      }))
      .finally(() => isMounted && setLoading(false));

    return () => {
      isMounted = false;
    };
  }, [promiseFn]);

  return { data, loading, error };
}