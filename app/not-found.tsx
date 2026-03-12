import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground mb-6">Page not found</p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
      >
        Go Home
      </Link>
    </div>
  );
}
