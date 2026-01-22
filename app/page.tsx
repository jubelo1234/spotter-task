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
    </div>
  );
}
