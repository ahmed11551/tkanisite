export default function ProductSkeleton() {
  return (
    <div className="rounded-[20px] border-[1.2px] border-[rgba(16,16,16,0.08)] bg-white">
      <div className="h-[380px] rounded-[10px] bg-gray-100 animate-pulse" />
      <div className="p-[10px] pt-[14px] pb-0">
        <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
        <div className="mt-3 h-4 w-1/3 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}


