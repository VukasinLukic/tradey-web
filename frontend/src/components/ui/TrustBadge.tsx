interface TrustBadgeProps {
  type: 'trusted-trader' | 'power-seller';
  className?: string;
}

export function TrustBadge({ type, className = '' }: TrustBadgeProps) {
  if (type === 'trusted-trader') {
    return (
      <div
        className={`inline-flex flex-col items-center gap-1 px-2 py-1.5 bg-green-500/10 border border-green-500 rounded ${className}`}
        title="Trusted Trader - Rating above 4.0"
      >
        <svg className="w-5 h-5 fill-green-600" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span className="font-sans text-[10px] font-semibold text-green-700 uppercase tracking-wide">
          Trusted
        </span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex flex-col items-center gap-1 px-2 py-1.5 bg-tradey-red/10 border border-tradey-red rounded ${className}`}
      title="Power Seller - 10+ posts published"
    >
      <svg className="w-5 h-5 fill-tradey-red" viewBox="0 0 24 24">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span className="font-sans text-[10px] font-semibold text-tradey-red uppercase tracking-wide">
        Power Seller
      </span>
    </div>
  );
}
