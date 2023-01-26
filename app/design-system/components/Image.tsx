import { type FC, cloneElement, isValidElement, useState } from "react";
import { mapChildrenSafe } from "../util/mapChildrenSafe";

export type SourceElementProps = {
  erroredSrcs?: string[];
};

export type ImageType = FC<{
  imageName: string;
  alt: string;
  className?: string;
}> & {
  Picture: FC;
  Src: FC<{ srcSet: string } & SourceElementProps>;
  Img: FC<
    { src: string; alt: string; className?: string } & SourceElementProps
  >;
};

/**
 * Used for any non user-provided image.
 * TODO: User-provided images will need a different solution.
 */
export const Image: ImageType = ({ imageName, alt, className }) => {
  return (
    <Picture>
      <Src srcSet={`/images/${imageName}/${imageName}.webp`} />
      <Img
        src={`/images/${imageName}/${imageName}.jpg`}
        alt={alt}
        className={className}
      />
    </Picture>
  );
};

const Picture: ImageType["Picture"] = ({ children }) => {
  const [erroredSrcs, setErroredSrcs] = useState<string[]>([]);

  return (
    <picture
      onError={(event) => {
        setErroredSrcs((prev) => [
          ...prev,
          (event.target as HTMLImageElement).currentSrc,
        ]);
      }}
    >
      {mapChildrenSafe(children, (child) =>
        cloneElement(child, {
          erroredSrcs,
        })
      )}
    </picture>
  );
};
Image.Picture = Picture;

const Src: ImageType["Src"] = ({ srcSet, erroredSrcs = [] }) => {
  if (erroredSrcs.includes(srcSet)) return null;
  return <source srcSet={srcSet} />;
};
Image.Src = Src;

const Img: ImageType["Img"] = ({ src, alt, className }) => {
  return <img src={src} alt={alt} className={className} />;
};
Image.Img = Img;
