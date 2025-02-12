/* import { useEffect, useState } from "react";
import { UserFromServer } from "@/srcApp/entities/user/model/types";

export const useIcon = (
  imageUrl: string | undefined,
  logIn: string,
  user?: UserFromServer | null,
): { imageSrc: string; isImageLoaded: boolean | null } => {
  const [imageSrc, setImageSrc] = useState<string>(logIn);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean | null>(null);

  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        setIsImageLoaded(true);
        setImageSrc(imageUrl || logIn);
      };
      img.onerror = () => {
        setImageSrc(logIn);
        setIsImageLoaded(false);
        return;
      };
    }
    setImageSrc(logIn);
  }, [imageUrl]);

  return { imageSrc, isImageLoaded };
};
 */
