import { useState } from 'react';

const PALETTE = [
  '#1a2d5a', '#c8202d', '#2563eb', '#7c3aed',
  '#059669', '#d97706', '#0891b2', '#be185d',
];

function pickColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = seed.charCodeAt(i) + ((h << 5) - h);
  return PALETTE[Math.abs(h) % PALETTE.length];
}

function initials(firstName?: string, lastName?: string): string {
  const f = (firstName || '').charAt(0).toUpperCase();
  const l = (lastName || '').charAt(0).toUpperCase();
  return (f + l) || '?';
}

interface UserAvatarProps {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
  size?: number;
  className?: string;
}

export function UserAvatar({ firstName, lastName, avatarUrl, size = 40, className = '' }: UserAvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const letters = initials(firstName, lastName);
  const bg = pickColor((firstName || '') + (lastName || ''));
  const fontSize = Math.round(size * 0.36);

  if (avatarUrl && !imgFailed) {
    return (
      <img
        src={avatarUrl}
        alt={`${firstName ?? ''} ${lastName ?? ''}`.trim()}
        onError={() => setImgFailed(true)}
        style={{ width: size, height: size }}
        className={`rounded-full object-cover shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size, backgroundColor: bg, fontSize }}
      className={`rounded-full flex items-center justify-center text-white font-semibold shrink-0 select-none ${className}`}
    >
      {letters}
    </div>
  );
}
