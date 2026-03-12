"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
      <p className="text-muted-foreground mb-6">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
      >
        Try Again
      </button>
    </div>
  );
}
