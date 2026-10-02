import { Link } from "react-router-dom";

const paths = {
  edit: (
    <>
      <path d="m16 3 5 5-12 12-6 1 1-6Z" />
      <path d="m14 5 5 5" />
    </>
  ),
  inventory: (
    <>
      <path d="m12 3 9 5v8l-9 5-9-5V8Z" />
      <path d="m3 8 9 5 9-5M12 13v8M7.5 5.5l9 5" />
    </>
  ),
  view: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
};

export function ProductAction({ icon, label, to, onClick, disabled }) {
  const className =
    "tw:inline-flex tw:size-11 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-xl tw:border tw:border-solid tw:border-[#d9ddcf] tw:bg-[#fffefa] tw:p-0 tw:text-[#536345] tw:no-underline tw:transition-colors tw:hover:bg-[#e9eddf] tw:hover:border-[#a6b497] tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-[#536345] tw:disabled:opacity-40 tw:disabled:cursor-not-allowed";
  const content = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[icon]}
    </svg>
  );
  return to ? (
    <Link className={className} to={to} aria-label={label} title={label}>
      {content}
    </Link>
  ) : (
    <button
      className={className}
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
