/** Theme placeholder illustration (pillow), used in empty states and the popup. */
export function PillowArt({ id = 'pl' }: { id?: string }) {
  return (
    <svg className="sn-art " viewBox="0 0 600 750" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`bg${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2EBE0" />
          <stop offset="1" stopColor="#E4D8C6" />
        </linearGradient>
        <radialGradient id={`gl${id}`} cx="50%" cy="30%" r="60%">
          <stop offset="0" stopColor="#fff" stopOpacity=".7" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="600" height="750" fill={`url(#bg${id})`} />
      <rect width="600" height="750" fill={`url(#gl${id})`} />
      <circle cx="300" cy="300" r="210" fill="#FFFDF9" opacity=".55" />
      <ellipse cx="300" cy="600" rx="190" ry="18" fill="#1B2130" opacity="0.18" />
      <path d="M110 300 q190 -40 380 0 q30 120 0 240 q-190 40 -380 0 q-30 -120 0 -240Z" fill="#FFFDF9" />
      <path d="M160 330 Q300 300 440 330 M150 520 Q300 545 450 520" stroke="#E3D9C9" strokeWidth="3" fill="none" />
      <path d="M200 420 q100 20 200 0" stroke="#E3D9C9" strokeWidth="3" fill="none" />
      <path d="M110 300 q-14 -10 -20 -26 M490 300 q14 -10 20 -26 M110 540 q-14 10 -20 26 M490 540 q14 10 20 26" stroke="#E3D9C9" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
