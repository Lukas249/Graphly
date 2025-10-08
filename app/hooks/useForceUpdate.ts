import { useCallback, useState } from "react";

export default function useForceUpdate() {
  const [, toggle] = useState(false);
  return useCallback(() => toggle((t) => !t), []);
}