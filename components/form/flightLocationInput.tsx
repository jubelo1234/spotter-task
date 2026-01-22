"use client";

import { Group, GroupSeparator, GroupText } from "@/components/ui/group";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

import FormErrorText from "@/components/form/formErrorText";

type FlightLocationInputType = {
  name: string;
  placeholder: string;
  error: string | undefined;
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
};

export default function FlightLocationInput({
  name,
  placeholder,
  error,
  value,
  onChange,
  icon,
}: FlightLocationInputType) {
  const Icon = icon;

  return (
    <div>
      <Group className="w-full h-10">
        <GroupText className="text-muted-foreground">
          <Icon className="size-4.5" aria-hidden="true" />
        </GroupText>
        <GroupSeparator />
        <Input
          name={name}
          aria-label={name}
          placeholder={placeholder}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className="focus-visible:ring-0 h-full"
        />
      </Group>
      {error ? <FormErrorText error={error} /> : null}
    </div>
  );
}
