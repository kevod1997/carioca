// src/components/ui/navigate-button.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, ButtonProps } from "@/components/ui/button";

interface NavigateButtonProps extends Omit<ButtonProps, "onClick"> {
  href: string;
}

export function NavigateButton({ href, children, ...props }: NavigateButtonProps) {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = () => {
    setIsNavigating(true);
  };

  return (
    <Link href={href} passHref>
      <Button onClick={handleClick} isLoading={isNavigating} {...props}>
        {children}
      </Button>
    </Link>
  );
}