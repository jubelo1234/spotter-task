import FlightSearchForm from "./sections/flightSearchForm";

export default function Home() {
  return (
    <div className="mt-8 sm:mt-14 lg:mt-20 x-padding">
      <div className=" mb-6 sm:mb-8 space-y-2 text-center">
        <h1 className="text-3xl font-semibold font-pl tracking-tight sm:text-4xl md:text-5xl">
          Find your next adventure
        </h1>
        <p className="text-muted-foreground text-lg max-sm:leading-snug mt-[3px] sm:mt-2.5">
          Search flights to everywhere, from anywhere.
        </p>
      </div>
      <FlightSearchForm />

      {/* flight list section */}
      <div>
        <div className="bg-white rounded-lg border border-card-border p-3">
          <div className="flex justify-start items-center gap-2.5">
            <div className="size-12 rounded-[6px] bg-gray-200"></div>
            <h3 className="text-xl font-bold text-primary">Delta Airlines</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
