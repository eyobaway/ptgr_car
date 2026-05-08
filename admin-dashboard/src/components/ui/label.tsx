"use client"

import * as React from "react"
import { Field } from "@base-ui/react/field"

import { cn } from "@/lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-sm font-bold leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-50 select-none",
        className
      )}
      {...props}
    />
  )
}

export { Label }
