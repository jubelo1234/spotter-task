import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";

export default function TabSelect({
  value,
  setValue,
  options,
}: {
  value: string;
  setValue: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabsList className="sm:w-[200px] w-full">
        {options.map((option) => (
          <TabsTab
            key={option.value}
            className="data-active:bg-primary h-[38px] data-active:text-white"
            value={option.value}
          >
            {option.label}
          </TabsTab>
        ))}
      </TabsList>
    </Tabs>
  );
}
