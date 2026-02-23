/**
 * Inline SVG icons for section headers. All use 24x24 viewBox; size/color via CSS.
 */
const iconProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function KeyIcon({ className }) {
  return (
    <svg {...iconProps} className={className} aria-hidden>
      <circle cx="10" cy="8" r="3" />
      <path d="M10 11v6m0 0h3v3h2v-3h3v-2h-8Z" />
    </svg>
  );
}

export function FogGateIcon({ className }) {
  return (
    <svg {...iconProps} className={className} aria-hidden>
      <path d="M4 6h16v2H4z" />
      <path d="M6 6v12M18 6v12" />
      <path d="M4 18h16" />
    </svg>
  );
}

export function ProgressIcon({ className }) {
  return (
    <svg {...iconProps} className={className} aria-hidden>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

export function BellIcon({ className }) {
  return (
    <svg {...iconProps} className={className} aria-hidden>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function ShortcutIcon({ className }) {
  return (
    <svg {...iconProps} className={className} aria-hidden>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export function FirelinkIcon({ className }) {
  return (
    <svg {...iconProps} className={className} aria-hidden>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.08-2.08-.5-4 0-5 .5-1 1-1.5 2-2s2.5-.5 4 0 2 1 2.5 2 .5 2.5 0 0 1 0 4-2.5.5-2.5 2.5 0 0 1 0 7" />
      <path d="M14 10s.5 2 1 3 1.5 2 1.5 4" />
    </svg>
  );
}

export function NodesIcon({ className }) {
  return (
    <svg {...iconProps} className={className} aria-hidden>
      <circle cx="12" cy="5" r="3" />
      <circle cx="5" cy="19" r="3" />
      <circle cx="19" cy="19" r="3" />
      <path d="M12 8v3M9.5 18.5l2.5-3.5M14.5 18.5 12 15" />
    </svg>
  );
}

export function MapIcon({ className }) {
  return (
    <svg {...iconProps} className={className} aria-hidden>
      <path d="M2 6v13l6-3 6 3 6-3V3l-6 3-6-3-6 3z" />
      <path d="M8 3v13M16 6v13" />
    </svg>
  );
}

export function CodeIcon({ className }) {
  return (
    <svg {...iconProps} className={className} aria-hidden>
      <path d="M16 18l6-6-6-6" />
      <path d="M8 6l-6 6 6 6" />
    </svg>
  );
}
