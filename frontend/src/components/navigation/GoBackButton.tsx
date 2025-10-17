import { useNavigate } from 'react-router-dom';

export function GoBackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="fixed top-6 right-6 z-40 px-4 py-2 bg-tradey-black text-tradey-white font-sans text-sm uppercase tracking-wide hover:bg-tradey-red transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Back
    </button>
  );
}
