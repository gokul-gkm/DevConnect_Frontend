import { Slider } from "@/components/ui/Slider";
import { useState, useEffect } from "react"

interface PriceRangeFilterProps {
  onChange: (range: { min: number; max: number }) => void;
}

export function PriceRangeFilter({ onChange }: PriceRangeFilterProps) {
  const [range, setRange] = useState([0, 1000])

  useEffect(() => {
    onChange({ min: range[0], max: range[1] })
  }, [range, onChange])

  return (
    <div className="space-y-4">
      <h3 className="text-white font-medium mb-3">Hourly Rate (USD)</h3>
      <Slider
        defaultValue={[0, 1000]}
        max={1000}
        step={5}
        value={range}
        onValueChange={setRange}
        className="w-full"
      />
      <div className="flex justify-between text-sm text-gray-400">
        <span>${range[0]}</span>
        <span>${range[1]}</span>
      </div>
    </div>
  )
}