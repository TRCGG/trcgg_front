import { useEffect, useState } from "react";
import { loadSpriteData, isSpriteDataLoaded } from "@/utils/spriteLoader";

/**
 * sprite 데이터를 로드하는 hook. 앱 최상위에서 한 번만 호출
 */
const useSpriteLoader = () => {
  const [isLoaded, setIsLoaded] = useState(isSpriteDataLoaded());
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isLoaded) return;

    loadSpriteData()
      .then(() => {
        setIsLoaded(true);
      })
      .catch((err) => {
        setError(err);
      });
  }, [isLoaded]);

  return { isLoaded, error };
};

export default useSpriteLoader;
