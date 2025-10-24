import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  onAction?: () => void;
}

/**
 * Empty state component for when there's no data to show
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionLink,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-tradey-black/20 rounded">
      {icon && <div className="mb-6">{icon}</div>}

      <h2 className="font-fayte text-2xl text-tradey-black mb-2 tracking-tight uppercase">
        {title}
      </h2>

      <p className="font-sans text-tradey-black/60 text-sm mb-6 text-center max-w-md">
        {description}
      </p>

      {actionLabel && (actionLink || onAction) && (
        <>
          {actionLink ? (
            <Link
              to={actionLink}
              className="px-6 py-3 bg-tradey-red text-white font-sans text-sm hover:opacity-90 transition-opacity"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="px-6 py-3 bg-tradey-red text-white font-sans text-sm hover:opacity-90 transition-opacity"
            >
              {actionLabel}
            </button>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Icon components for empty states
 */
// Exported separately to avoid fast refresh warning
const EmptyIconsInternal = {
  NoItems: () => (
    <svg
      className="w-16 h-16 stroke-tradey-black/30"
      fill="none"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
      />
    </svg>
  ),
  NoPeople: () => (
    <svg
      className="w-16 h-16 stroke-tradey-black/30"
      fill="none"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  ),
  NoMessages: () => (
    <svg
      className="w-16 h-16 stroke-tradey-black/30"
      fill="none"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
      />
    </svg>
  ),
  NoSearch: () => (
    <svg
      className="w-16 h-16 stroke-tradey-black/30"
      fill="none"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
      />
    </svg>
  ),
};

export const EmptyIcons = EmptyIconsInternal;
