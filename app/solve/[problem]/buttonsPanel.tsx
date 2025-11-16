export function ButtonsPanel({
  isCodeJudging,
  handleRun,
  handleSubmit,
}: {
  isCodeJudging: boolean;
  handleRun: () => Promise<void>;
  handleSubmit: () => Promise<void>;
}) {
  return isCodeJudging ? (
    <button
      className="btn m-2 mx-auto flex w-fit flex-row justify-center gap-2"
      disabled
    >
      <span className="loading loading-spinner loading-xs"></span>
      Processing...
    </button>
  ) : (
    <div className="flex flex-row justify-center gap-5 p-2">
      <button onClick={handleRun} className="btn-gray">
        Run
      </button>
      <button onClick={handleSubmit} className="btn">
        Submit
      </button>
    </div>
  );
}
