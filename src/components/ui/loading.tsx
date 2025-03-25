// src/components/ui/loading.tsx
import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex justify-center items-center", className)}>
      <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center p-8">
      <LoadingSpinner className="mb-4" />
      <p className="text-muted-foreground text-sm">Cargando...</p>
    </div>
  );
}