import Menu from "../menu";

export default function Loading() {
  return (
    <div className="min-h-screen">
      <Menu />
      <div className="mx-auto my-10 max-w-2xl">
        <h2 className="daisyui-skeleton h-10 w-32 text-xl"></h2>
        <div className="w-full text-center">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="daisyui-skeleton my-2 flex h-10 items-center justify-between rounded-lg px-4"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
