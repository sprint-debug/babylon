import DOMPurify from 'dompurify';
import { t } from 'i18next';
import parse from 'html-react-parser';
import React from 'react';

export type TextLocale = {
  textId: string;
  values: any;
};

export interface TextCoreProps {
  locale?: TextLocale;
  text?: string;
  hasTag?: boolean;
}

const TextCore = ({ locale, text, hasTag = false }: TextCoreProps) => {
  const contents = React.useMemo(() => {
    if (text) {
      return hasTag ? parse(DOMPurify.sanitize(text)) : text;
    } else if (locale) {
      t(locale.textId);
    } else {
      return 'TEXT';
    }
  }, [locale, text, hasTag]);

  return <React.Fragment>{contents}</React.Fragment>;
};

export default TextCore;
