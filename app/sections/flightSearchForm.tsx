"use client";
import { useCallback, useMemo, useState, type FormEvent } from "react";
import { addDays, startOfDay } from "date-fns";
import TabSelect from "@/components/form/tabSelect";
import PassengerInput, {
  type PassengerValue,
} from "@/components/form/passengerInput";
import FlightLocationInput from "@/components/form/flightLocationInput";
import { PlaneLanding, PlaneTakeoff, Search } from "lucide-react";
import { DatePicker } from "@/components/form/datePicker";
import FormErrorText from "@/components/form/formErrorText";

type FlightSearchErrors = {
  departure?: string;
  arrival?: string;
  departureDate?: string;
  returnDate?: string;
};

function FlightSearchForm() {
  const [value, setValue] = useState<"one-way" | "round-trip">("one-way");
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    undefined,
  );
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [passengers, setPassengers] = useState<PassengerValue>({
    adults: 1,
    children: 0,
    infantsSeat: 0,
    infantsLap: 0,
    cabin: "Economy",
  });

  const [errors, setErrors] = useState<FlightSearchErrors>({});

  const isRoundTrip = value === "round-trip";

  const minReturnDate = useMemo(() => {
    if (!departureDate) return undefined;
    return addDays(startOfDay(departureDate), 1);
  }, [departureDate]);

  const canPickReturn = Boolean(isRoundTrip && departureDate);

  const handleTripTypeChange = useCallback((next: string) => {
    const tripType = next === "round-trip" ? "round-trip" : "one-way";
    setValue(tripType);

    setErrors((prev) => ({ ...prev, returnDate: undefined }));
    if (tripType === "one-way") {
      setReturnDate(undefined);
    }
  }, []);

  const handleDepartureDateChange = useCallback(
    (next: Date | undefined) => {
      setDepartureDate(next);
      setErrors((prev) => ({
        ...prev,
        departureDate: undefined,
        returnDate: undefined,
      }));

      if (!next) {
        setReturnDate(undefined);
        return;
      }

      const minAllowedReturn = addDays(startOfDay(next), 1);
      if (returnDate && startOfDay(returnDate) < minAllowedReturn) {
        setReturnDate(undefined);
      }
    },
    [returnDate],
  );

  const handleReturnDateChange = useCallback((next: Date | undefined) => {
    setReturnDate(next);
    setErrors((prev) => ({ ...prev, returnDate: undefined }));
  }, []);

  const validate = useCallback(() => {
    const nextErrors: FlightSearchErrors = {};

    if (!departure.trim()) nextErrors.departure = "Please enter an origin.";
    if (!arrival.trim()) nextErrors.arrival = "Please enter a destination.";

    if (!departureDate) {
      nextErrors.departureDate = "Please select a departure date.";
    }

    if (isRoundTrip) {
      if (!departureDate) {
        nextErrors.returnDate = "Select a departure date first.";
      } else if (!returnDate) {
        nextErrors.returnDate = "Please select a return date.";
      } else {
        const minAllowedReturn = addDays(startOfDay(departureDate), 1);
        if (startOfDay(returnDate) < minAllowedReturn) {
          nextErrors.returnDate = "Return date must be after departure date.";
        }
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [arrival, departure, departureDate, isRoundTrip, returnDate]);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validate()) return;

      const payload = {
        tripType: value,
        departure,
        arrival,
        passengers,
        departureDate,
        returnDate: isRoundTrip ? returnDate : undefined,
      };

      console.log("Flight search:", payload);
    },
    [
      arrival,
      departure,
      departureDate,
      isRoundTrip,
      passengers,
      returnDate,
      validate,
      value,
    ],
  );

  const options = [
    { value: "one-way", label: "One Way" },
    { value: "round-trip", label: "Round Trip" },
  ];
  return (
    <form
      className="space-y-3 relative border-card-border border rounded-xl pt-3 pb-7 max-w-5xl mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="flex px-3 flex-col gap-x-2.5 gap-y-2 sm:flex-row sm:items-center">
        <TabSelect
          value={value}
          setValue={handleTripTypeChange}
          options={options}
        />
        <div className="w-full sm:w-[320px]">
          <PassengerInput value={passengers} onChange={setPassengers} />
        </div>
      </div>
      <hr className="bg-card-border h-px w-full" />
      <div className="px-3 grid-cols-1 lg:grid-cols-[30fr_30fr_40fr] gap-2.5 grid">
        <FlightLocationInput
          name="departure"
          placeholder="Origin (e.g. Istanbul)"
          error={errors.departure}
          value={departure}
          onChange={(next) => {
            setDeparture(next);
            if (errors.departure)
              setErrors((prev) => ({ ...prev, departure: undefined }));
          }}
          icon={PlaneTakeoff}
        />
        <FlightLocationInput
          name="arrival"
          placeholder="Destination (e.g. London)"
          error={errors.arrival}
          value={arrival}
          onChange={(next) => {
            setArrival(next);
            if (errors.arrival)
              setErrors((prev) => ({ ...prev, arrival: undefined }));
          }}
          icon={PlaneLanding}
        />
        <div
          className={
            isRoundTrip ? "grid grid-cols-2 gap-2.5" : "grid grid-cols-1"
          }
        >
          <div>
            <DatePicker
              placeholder="Departure"
              value={departureDate}
              onChange={handleDepartureDateChange}
              futureOnly
            />
            {errors.departureDate ? (
              <FormErrorText error={errors.departureDate} />
            ) : null}
          </div>

          {isRoundTrip ? (
            <div>
              <DatePicker
                placeholder="Return"
                value={returnDate}
                onChange={handleReturnDateChange}
                disabled={!canPickReturn}
                futureOnly
                minDate={minReturnDate}
              />
              {errors.returnDate ? (
                <FormErrorText error={errors.returnDate} />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      <button
        type="submit"
        className="absolute cursor-pointer left-1/2 -translate-x-1/2 -bottom-5 bg-primary text-primary-foreground pr-[33px] pl-7 h-10  rounded-full font-medium flex items-center justify-center gap-2 text-sm"
      >
        <Search className="size-[17px]" />
        <p>Search</p>
      </button>
    </form>
  );
}

export default FlightSearchForm;
