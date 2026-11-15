import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathTexProps {
  tex: string;
  displayMode?: boolean;
  className?: string;
}

export const MathTex: React.FC<MathTexProps> = ({
  tex,
  displayMode = false,
  className = '',
}) => {
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        displayMode,
        throwOnError: false,
        strict: false,
      }),
    [tex, displayMode],
  );

  return (
    <span
      className={`inline-block align-middle ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
