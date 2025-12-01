export default function InlineSuccess({
  statusCode,
  title,
  className = "",
}: {
  statusCode?: number;
  title: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-6 bg-inherit border-success text-success rounded p-4 my-2 ${className}`}
      role="alert"
    >
      {statusCode && (
        <span className="text-3xl font-bold text-inherit min-w-[3rem] text-center">
          {statusCode}
        </span>
      )}
      <span className="h-8 border-l border-inherit mx-2" />
      <span className="text-base text-inherit">{title}</span>
    </div>
  );
}