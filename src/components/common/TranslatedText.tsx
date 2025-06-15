
import React from 'react';
import { useTranslation } from 'react-i18next';

interface TranslatedTextProps {
  i18nKey: string;
  values?: Record<string, unknown>;
  children?: React.ReactNode;
  className?: string;
  ns?: string;
}

/**
 * TranslatedText provides improved fallback handling.
 * 1. Returns the translation if found
 * 2. If not found and children exist, render the children
 * 3. Otherwise, show a friendly fallback label for missing translation in production
 *    and a helpful warning in the browser console in development
 */
const TranslatedText: React.FC<TranslatedTextProps> = ({
  i18nKey,
  values,
  children,
  className = '',
  ns,
}) => {
  const { t, i18n } = useTranslation(ns);

  // Try to translate. If no key found, returns the key itself.
  const translated = t(i18nKey, values);

  // If translation equals the key, it's missing in this language+namespace
  const isMissing = translated === i18nKey;

  if (isMissing) {
    if (process.env.NODE_ENV !== 'production') {
      // Console warn only in development
      // At runtime, only show this to devs to avoid polluting logs in prod
      // Showing details helps rapidly diagnose the missing translation
      // You can also check if ns is passed correctly and which language is active
      // If you spot these warnings, you should add the translation in your files!
      // eslint-disable-next-line no-console
      console.warn(`[i18n] MISSING TRANSLATION: "${i18nKey}" (ns="${ns || 'default'}", lang="${i18n.language}")`);
    }

    if (children) {
      return <span className={className}>{children}</span>;
    }

    // Show a friendly label for missing translations in the UI
    return (
      <span className={className} style={{ color: 'red', fontStyle: 'italic' }}>
        {/* Don't show raw keys to end user! */}
        {/* Example: [Missing translation: Brand title] */}
        [Missing translation]
      </span>
    );
  }

  // Normal translation result
  return <span className={className}>{translated}</span>;
};

export default TranslatedText;
