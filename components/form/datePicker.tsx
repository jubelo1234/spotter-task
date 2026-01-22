"use client";

import * as React from "react";
import { format, startOfDay } from "date-fns";
import { CalendarDays } from "lucide-react";
import type { Matcher } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type DatePickerProps = {
  placeholder: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
  futureOnly?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Matcher | Matcher[];
};

export function DatePicker({
  placeholder,
  value,
  onChange,
  disabled = false,
  futureOnly = false,
  minDate,
  maxDate,
  disabledDates,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const disabledMatchers = React.useMemo<Matcher[]>(() => {
    const matchers: Matcher[] = [];

    if (futureOnly) {
      matchers.push({ before: startOfDay(new Date()) });
    }

    if (minDate) {
      matchers.push({ before: startOfDay(minDate) });
    }

    if (maxDate) {
      matchers.push({ after: startOfDay(maxDate) });
    }

    if (disabledDates) {
      matchers.push(
        ...(Array.isArray(disabledDates) ? disabledDates : [disabledDates]),
      );
    }

    return matchers;
  }, [disabledDates, futureOnly, maxDate, minDate]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value}
          className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal h-10"
          disabled={disabled}
        >
          <CalendarDays className="size-4.5" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(next) => {
            onChange(next);
            if (next) setOpen(false);
          }}
          disabled={disabledMatchers}
        />
      </PopoverContent>
    </Popover>
  );
}
