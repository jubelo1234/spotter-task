"use client";

import { useCallback, useMemo, useState } from "react";
import { MinusIcon, PlusIcon, UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import FormSelect, {
  type FormSelectOption,
} from "@/components/form/formSelect";

export type CabinClass = "Economy" | "Premium Eco." | "Business" | "First";

export type PassengerValue = {
  adults: number;
  children: number;
  infantsSeat: number;
  infantsLap: number;
  cabin: CabinClass;
};

type StepperRowProps = {
  label: string;
  description?: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  canDecrement?: boolean;
  canIncrement?: boolean;
};

const CABINS: CabinClass[] = ["Economy", "Premium Eco.", "Business", "First"];

const MAX_TRAVELERS = 9;
const MIN_ADULTS = 1;

function getTotalTravelers(v: PassengerValue) {
  return v.adults + v.children + v.infantsSeat + v.infantsLap;
}

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return count === 1 ? singular : plural;
}

function clampValue(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizePassengerValue(next: PassengerValue): PassengerValue {
  const adults = clampValue(next.adults, MIN_ADULTS, MAX_TRAVELERS);

  let infantsLap = clampValue(next.infantsLap, 0, adults);
  let infantsSeat = clampValue(next.infantsSeat, 0, MAX_TRAVELERS);
  let children = clampValue(next.children, 0, MAX_TRAVELERS);

  const total = adults + children + infantsSeat + infantsLap;
  if (total > MAX_TRAVELERS) {
    const overflow = total - MAX_TRAVELERS;
    const reduceFrom = (current: number, amount: number) =>
      Math.max(0, current - amount);

    const reducedChildren = reduceFrom(children, overflow);
    const remainingAfterChildren = overflow - (children - reducedChildren);
    children = reducedChildren;

    const reducedInfantsSeat = reduceFrom(infantsSeat, remainingAfterChildren);
    const remainingAfterInfantsSeat =
      remainingAfterChildren - (infantsSeat - reducedInfantsSeat);
    infantsSeat = reducedInfantsSeat;

    const reducedInfantsLap = reduceFrom(infantsLap, remainingAfterInfantsSeat);
    infantsLap = clampValue(reducedInfantsLap, 0, adults);
  }

  return {
    adults,
    children,
    infantsSeat,
    infantsLap,
    cabin: next.cabin,
  };
}

type PassengerInputProps = {
  value: PassengerValue;
  onChange: (next: PassengerValue) => void;
  className?: string;
};

export default function PassengerInput({
  value,
  onChange,
  className,
}: PassengerInputProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<PassengerValue>(() =>
    normalizePassengerValue(value),
  );

  const updateDraft = useCallback(
    (updater: (prev: PassengerValue) => PassengerValue) => {
      setDraft((prev) => normalizePassengerValue(updater(prev)));
    },
    [],
  );

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (nextOpen) {
        setDraft(normalizePassengerValue(value));
      }
    },
    [value],
  );

  const handleDone = useCallback(() => {
    onChange(normalizePassengerValue(draft));
    setOpen(false);
  }, [draft, onChange]);

  const totalTravelers = useMemo(() => getTotalTravelers(value), [value]);
  const travelersLabel = useMemo(() => {
    return `${totalTravelers} ${pluralize(totalTravelers, "traveler")}`;
  }, [totalTravelers]);

  const cabinOptions = useMemo<FormSelectOption<CabinClass>[]>(
    () => CABINS.map((cabin) => ({ value: cabin, label: cabin })),
    [],
  );

  const draftTotal = useMemo(() => getTotalTravelers(draft), [draft]);

  const canAddMore = draftTotal < MAX_TRAVELERS;

  const canDecAdults = draft.adults > MIN_ADULTS;
  const canIncAdults = canAddMore;

  const canDecChildren = draft.children > 0;
  const canIncChildren = canAddMore;

  const canDecInfantsSeat = draft.infantsSeat > 0;
  const canIncInfantsSeat = canAddMore;

  const canDecInfantsLap = draft.infantsLap > 0;
  const canIncInfantsLap = canAddMore && draft.infantsLap < draft.adults;

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start focus-visible:ring-0 cursor-pointer gap-2 pl-0 pr-1.5 overflow-hidden rounded-lg border-border h-[40px] bg-background",
            className,
          )}
        >
          <span className="inline-flex size-10 items-center justify-center rounded-s-md bg-muted">
            <UserIcon className="size-4 text-muted-foreground" />
          </span>
          <span className="min-w-0 flex-1 truncate text-left">
            {travelersLabel}
          </span>
          <span className="ml-auto inline-flex shrink-0 items-center rounded-[6px] bg-primary/10 px-2 py-1 text-[13px] font-medium text-primary">
            {value.cabin}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-[min(20rem,calc(100vw-2rem))] rounded-xl p-3"
        sideOffset={8}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="font-medium text-sm">Passengers</div>
            <div className="text-muted-foreground text-xs">
              {draftTotal} {pluralize(draftTotal, "traveler")}
            </div>
          </div>

          <FormSelect
            value={draft.cabin}
            onChange={(cabin) => updateDraft((prev) => ({ ...prev, cabin }))}
            placeholder="Cabin"
            options={cabinOptions}
            size="sm"
            position="popper"
            align="end"
            triggerClassName="w-38"
            contentClassName="w-38"
          />
        </div>

        <Separator className="my-3" />

        <div className="flex flex-col gap-4">
          <StepperRow
            label="Adults"
            value={draft.adults}
            onDecrement={() =>
              updateDraft((prev) => ({ ...prev, adults: prev.adults - 1 }))
            }
            onIncrement={() =>
              updateDraft((prev) => ({ ...prev, adults: prev.adults + 1 }))
            }
            canDecrement={canDecAdults}
            canIncrement={canIncAdults}
          />

          <StepperRow
            label="Children"
            description="Aged 2–11"
            value={draft.children}
            onDecrement={() =>
              updateDraft((prev) => ({ ...prev, children: prev.children - 1 }))
            }
            onIncrement={() =>
              updateDraft((prev) => ({ ...prev, children: prev.children + 1 }))
            }
            canDecrement={canDecChildren}
            canIncrement={canIncChildren}
          />

          <StepperRow
            label="Infants"
            description="In seat"
            value={draft.infantsSeat}
            onDecrement={() =>
              updateDraft((prev) => ({
                ...prev,
                infantsSeat: prev.infantsSeat - 1,
              }))
            }
            onIncrement={() =>
              updateDraft((prev) => ({
                ...prev,
                infantsSeat: prev.infantsSeat + 1,
              }))
            }
            canDecrement={canDecInfantsSeat}
            canIncrement={canIncInfantsSeat}
          />

          <StepperRow
            label="Infants"
            description="On lap"
            value={draft.infantsLap}
            onDecrement={() =>
              updateDraft((prev) => ({
                ...prev,
                infantsLap: prev.infantsLap - 1,
              }))
            }
            onIncrement={() =>
              updateDraft((prev) => ({
                ...prev,
                infantsLap: prev.infantsLap + 1,
              }))
            }
            canDecrement={canDecInfantsLap}
            canIncrement={canIncInfantsLap}
          />
        </div>

        <Separator className="my-3" />

        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            className="bg-gray-100 cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" className="cursor-pointer" onClick={handleDone}>
            Done
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function StepperRow({
  label,
  description,
  value,
  onDecrement,
  onIncrement,
  canDecrement = true,
  canIncrement = true,
}: StepperRowProps) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4">
      <div className="min-w-0">
        <div className="truncate font-medium text-sm">{label}</div>
        {description ? (
          <div className="text-muted-foreground text-xs">{description}</div>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          className={cn(
            "inline-flex size-9 items-center cursor-pointer justify-center rounded-md bg-muted text-foreground transition-colors hover:bg-muted/80 disabled:pointer-events-none disabled:opacity-50",
          )}
          onClick={onDecrement}
          disabled={!canDecrement}
        >
          <MinusIcon className="size-4" />
        </button>
        <div className="w-6 text-center font-medium text-sm tabular-nums">
          {value}
        </div>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          className={cn(
            "inline-flex size-9 items-center cursor-pointer justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50",
          )}
          onClick={onIncrement}
          disabled={!canIncrement}
        >
          <PlusIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
