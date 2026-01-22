"use client";

import { ReactNode, useId } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type FormSelectOption<T extends string> = {
  value: T;
  label: ReactNode;
};

export type FormSelectProps<T extends string> = {
  label?: string;
  name?: string;
  placeholder?: string;
  value: T;
  onChange: (value: T) => void;
  options: FormSelectOption<T>[];
  disabled?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  size?: "sm" | "default";
  align?: "start" | "center" | "end";
  position?: "item-aligned" | "popper";
};

export default function FormSelect<T extends string>({
  label,
  name,
  placeholder,
  value,
  onChange,
  options,
  disabled = false,
  containerClassName,
  labelClassName,
  triggerClassName,
  contentClassName,
  size = "default",
  align = "center",
  position = "item-aligned",
}: FormSelectProps<T>) {
  const id = useId();

  return (
    <div className={containerClassName}>
      {label ? (
        <Label htmlFor={id} className={labelClassName}>
          {label}
        </Label>
      ) : null}

      <Select
        name={name}
        value={value}
        onValueChange={(next) => onChange(next as T)}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          size={size}
          className={cn(
            triggerClassName,
            "focus-visible:ring-0",
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          position={position}
          align={align}
          className={contentClassName}
        >
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
