export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen max-w-custom w-full mx-auto px-4 my-16">
      {children}
    </div>
  );
}
