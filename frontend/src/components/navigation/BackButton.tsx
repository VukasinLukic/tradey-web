import { useNavigate } from 'react-router-dom';

export function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="hidden md:flex fixed top-6 left-6 z-40 items-center gap-2 text-tradey-black hover:text-tradey-red transition-colors group"
      aria-label="Go back"
    >
      <svg
        className="w-4 h-4 transition-transform group-hover:-translate-x-1"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span className="font-sans text-sm uppercase tracking-wide font-medium">Go Back</span>
    </button>
  );
}
