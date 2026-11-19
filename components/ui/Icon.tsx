/** Theme icon set (paths copied from the Sakooon Nocturne theme). */
const P: Record<string, React.ReactNode> = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  'arrow-left': <path d="M20 12H4M10 6l-6 6 6 6" />,
  'arrow-up-right': <path d="M7 17 17 7M8 7h9v9" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  check: <path d="m5 12 5 5 9-10" />,
  heart: <path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11Z" />,
  bag: (
    <>
      <path d="M5 8h14l-1 13H6L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
      <circle cx="7.5" cy="17.5" r="1.8" />
      <circle cx="17.5" cy="17.5" r="1.8" />
    </>
  ),
  ruler: (
    <>
      <rect x="2.5" y="8" width="19" height="8" rx="1.5" />
      <path d="M6 8v3M9.5 8v4.5M13 8v3M16.5 8v4.5" />
    </>
  ),
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />,
  exchange: (
    <>
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
    </>
  ),
  phone: <path d="M5 4.5h3l1.3 4.3-2 1.6a12 12 0 0 0 6.3 6.3l1.6-2 4.3 1.3v3c0 1-.8 1.5-1.7 1.4A17 17 0 0 1 4 7.2c-.1-.9.4-1.7 1-1.7Z" />,
  box: <path d="M3 7l9-4 9 4v10l-9 4-9-4V7ZM3 7l9 4 9-4M12 11v10" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  home: <path d="M3 11l9-8 9 8M5 10v10h14V10" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />,
  note: (
    <>
      <path d="M5 4h14v16H5z" />
      <path d="M8 9h8M8 13h8M8 17h5" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6" />
    </>
  ),
};

const FILLED: Record<string, React.ReactNode> = {
  whatsapp: (
    <path d="M12 2.5a9.3 9.3 0 0 0-8 14l-1.2 5 5.1-1.3A9.3 9.3 0 1 0 12 2.5Zm0 1.8a7.5 7.5 0 1 1-3.9 13.9l-.4-.2-3 .8.8-2.9-.3-.4A7.5 7.5 0 0 1 12 4.3Zm-3.6 3.9c-.2 0-.5.1-.7.4-.2.3-.9.9-.9 2s.9 2.3 1 2.4c.1.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3l-1.9-.9c-.3-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.4-1.8-.2-.3 0-.4.1-.5l.4-.5.3-.4v-.5l-.8-2c-.2-.5-.4-.5-.6-.5h-.5Z" />
  ),
  'heart-filled': <path d="M12 20s-7.5-4.6-9.7-9.3C.7 6.9 3 3.5 6.6 3.5c2 0 3.6 1 5.4 3 1.8-2 3.4-3 5.4-3 3.6 0 5.9 3.4 4.3 7.2C19.5 15.4 12 20 12 20Z" />,
  facebook: <path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1Z" />,
};

export function Icon({ name, className = 'icon', strokeWidth = 1.7 }: { name: string; className?: string; strokeWidth?: number }) {
  if (FILLED[name])
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        {FILLED[name]}
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {P[name]}
    </svg>
  );
}

/** Outline + filled heart pair used by wishlist buttons. */
export function WishIcons() {
  return (
    <>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="icon icon--outline" aria-hidden="true">
        {P.heart}
      </svg>
      <svg viewBox="0 0 24 24" className="icon icon--filled" aria-hidden="true">
        <path d="M12 20s-7.5-4.6-9.7-9.3C.7 6.9 3 3.5 6.6 3.5c2 0 3.6 1 5.4 3 1.8-2 3.4-3 5.4-3 3.6 0 5.9 3.4 4.3 7.2C19.5 15.4 12 20 12 20Z" fill="currentColor" />
      </svg>
    </>
  );
}
