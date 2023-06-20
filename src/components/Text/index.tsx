import React from 'react';
import Skeleton from '../_core/SkeletonCore';
import TextCore, { TextCoreProps } from '../_core/TextCore';

export interface TextProps extends TextCoreProps {
  loading?: boolean;
  className?: string;
  max?: number;
}

const Text = ({ loading = false, locale, hasTag, text }: TextProps) => {
  return (
    <React.Fragment>
      {loading ? (
        <Skeleton skeletonType={'rect'} />
      ) : (
        <TextCore hasTag={hasTag} locale={locale} text={text} />
      )}
    </React.Fragment>
  );
};

export default Text;
