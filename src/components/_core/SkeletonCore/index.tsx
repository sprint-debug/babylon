import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export type SkeletonType = 'circle' | 'rect';

type SkeletonProps = {
  skeletonType?: SkeletonType;
};

const SkeletonCore = ({ skeletonType = 'rect' }: SkeletonProps) => {
  return <Skeleton circle={skeletonType === 'circle'} />;
};

export default SkeletonCore;
