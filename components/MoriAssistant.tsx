'use client';

import Image from 'next/image';
import { useState } from 'react';

export type MoriState = 'idle' | 'writing' | 'success';

type MoriAssistantProps = {
  state?: MoriState;
  title: string;
  message?: string;
  className?: string;
};

const MORI_ASSETS: Record<MoriState, { src: string; alt: string }> = {
  idle: { src: '/mori/mori-idle.png', alt: 'Mori assistant standing calmly' },
  writing: { src: '/mori/mori-writing.png', alt: 'Mori assistant writing a report' },
  success: { src: '/mori/mori-success.png', alt: 'Mori assistant confirming completion' },
};

export function MoriAssistant({ state = 'idle', title, message, className = '' }: MoriAssistantProps) {
  const [failedSources, setFailedSources] = useState<Partial<Record<MoriState, boolean>>>({});
  const asset = MORI_ASSETS[state];
  const hasImage = !failedSources[state];

  return (
    <div className={`mori-assistant mori-assistant--${state} ${className}`.trim()}>
      {hasImage ? (
        <div className="mori-assistant__imageWrap" aria-hidden="true">
          <Image
            className="mori-assistant__image"
            src={asset.src}
            alt={asset.alt}
            width={112}
            height={112}
            priority={state === 'idle'}
            onError={() => setFailedSources((current) => ({ ...current, [state]: true }))}
          />
        </div>
      ) : null}
      <div className="mori-assistant__message">
        <p className="mori-assistant__title">{title}</p>
        {message ? <p className="mori-assistant__body">{message}</p> : null}
      </div>
    </div>
  );
}
