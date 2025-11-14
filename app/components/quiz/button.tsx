type Props = {
  onClickHandler: () => void;
  disabled: boolean;
  text: string;
};

export default function SubmitButton({
  onClickHandler,
  disabled,
  text,
}: Props) {
  return (
    <button
      onClick={onClickHandler}
      disabled={disabled}
      className="border-primary bg-primary mt-12 w-full transform cursor-pointer rounded-lg border px-5 py-1.5 text-base font-semibold text-white transition duration-300 ease-in-out outline-none hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:border-gray-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:hover:scale-100"
    >
      {text}
    </button>
  );
}
