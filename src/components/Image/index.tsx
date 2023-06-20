import React from 'react';
import ImageCore, { ImageCoreProps } from '../_core/ImageCore';
import Skeleton, { SkeletonType } from '../_core/SkeletonCore';

export interface ImageProps extends ImageCoreProps {
  loading?: boolean;
  skeletonType?: SkeletonType;
}

const Image = ({ loading = false, skeletonType, src, alt }: ImageProps) => {
  return (
    <React.Fragment>
      {loading ? (
        <Skeleton skeletonType={skeletonType} />
      ) : (
        <ImageCore src={src} alt={alt} />
      )}
    </React.Fragment>
  );
};

export default Image;
