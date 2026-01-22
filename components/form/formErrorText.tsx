export default function FormErrorText({
  error,
}: {
  error: string | undefined;
}) {
  return (
    <p className="text-red-500 text-[13px] font-medium mt-2 scroll-to-error-here">
      {error}
    </p>
  );
}
