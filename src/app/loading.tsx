export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      <span className="sr-only">加载中</span>
      <span className="sweep-line-y absolute left-0 top-0 h-full w-[30vw] bg-black dark:bg-white" />
      <span className="sweep-line-x absolute bottom-0 left-0 h-[30svh] w-full bg-black dark:bg-white" />
    </div>
  );
}
