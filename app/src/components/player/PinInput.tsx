const PinInput = () => {
  return (
    <div className="py-2 px-3">
      <div className="flex gap-x-5" data-hs-pin-input="">
        <input
          className="block size-[38px] bg-slate-700 text-center border-white rounded-md text-sm placeholder:text-white disabled:opacity-50 disabled:pointer-events-none"
          type="text"
          placeholder="○"
          data-hs-pin-input-item=""
          autoFocus={true}
        />
        <input
          className="block size-[38px] text-center border-gray-200 rounded-md text-sm placeholder:text-gray-300 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          type="text"
          placeholder="○"
          data-hs-pin-input-item=""
        />
        <input
          className="block size-[38px] text-center border-gray-200 rounded-md text-sm placeholder:text-gray-300 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          type="text"
          placeholder="○"
          data-hs-pin-input-item=""
        />
        <input
          className="block size-[38px] text-center border-gray-200 rounded-md text-sm placeholder:text-gray-300 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          type="text"
          placeholder="○"
          data-hs-pin-input-item=""
        />
      </div>
    </div>
  );
};
