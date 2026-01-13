"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
   
    <SliderPrimitive.Track
      className="
        relative h-2 w-full grow overflow-hidden rounded-full
        bg-gray-300 dark:bg-gray-700
      "
    >

      <SliderPrimitive.Range
        className="
          absolute h-full rounded-full
          bg-indigo-600 dark:bg-indigo-500
        "
      />
    </SliderPrimitive.Track>

    <SliderPrimitive.Thumb
      className="
        block h-5 w-5 rounded-full
        bg-white dark:bg-gray-100
        border border-gray-400 dark:border-gray-600
        shadow-md
        transition-all duration-200
        hover:scale-110
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-indigo-500
        focus-visible:ring-offset-2
        focus-visible:ring-offset-white
        dark:focus-visible:ring-offset-gray-900
      "
    />
  </SliderPrimitive.Root>
))

Slider.displayName = "Slider"

export { Slider }
