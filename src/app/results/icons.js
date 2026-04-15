function IconBase({
  children,
  size = 20,
  className,
  fill = "none",
  strokeWidth = 1.9,
  ...props
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </IconBase>
  );
}

export function MapPinIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 21s-6-5.1-6-11a6 6 0 1 1 12 0c0 5.9-6 11-6 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </IconBase>
  );
}

export function CompassIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.8 9.2 9.5 11.5 7.2 16.8l5.3-2.3 2.3-5.3Z" />
    </IconBase>
  );
}

export function PlusCircleIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </IconBase>
  );
}

export function BanIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 15.5 7-7" />
    </IconBase>
  );
}

export function VolumeXIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M11 5 7.5 8H5v8h2.5L11 19V5Z" />
      <path d="m15.5 9.5 4 5" />
      <path d="m19.5 9.5-4 5" />
    </IconBase>
  );
}

export function StarIcon({ filled = false, ...props }) {
  return (
    <IconBase {...props} fill={filled ? "currentColor" : "none"}>
      <path d="m12 3.8 2.3 4.7 5.2.8-3.8 3.7.9 5.2L12 15.8 7.4 18.2l.9-5.2-3.8-3.7 5.2-.8L12 3.8Z" />
    </IconBase>
  );
}

export function ThumbsUpIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M8 11v9H5V11h3Z" />
      <path d="M11 20h5.5a2 2 0 0 0 2-1.6l1-5A2 2 0 0 0 17.5 11H14V7.8c0-1.5-.9-2.8-2.3-3.3L10 11v9Z" />
    </IconBase>
  );
}

export function ArrowRightIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </IconBase>
  );
}

export function ShareIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="18" cy="5" r="2" />
      <circle cx="6" cy="12" r="2" />
      <circle cx="18" cy="19" r="2" />
      <path d="m8 11 8-5" />
      <path d="m8 13 8 5" />
    </IconBase>
  );
}

export function CameraIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 8h4l1.4-2h5.2L16 8h4v10H4V8Z" />
      <circle cx="12" cy="13" r="3.5" />
    </IconBase>
  );
}

export function LoaderIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 3a9 9 0 1 0 9 9" />
    </IconBase>
  );
}
