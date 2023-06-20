import React from 'react';

export interface ImageCoreProps {
  src: string;
  alt?: string;
}

const ImageCore = ({ src, alt }: ImageCoreProps) => {
  const onError = React.useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      e.currentTarget.src == '';
    },
    [src],
  );

  return <img src={src} alt={alt} onError={onError} />;
};

export default ImageCore;
