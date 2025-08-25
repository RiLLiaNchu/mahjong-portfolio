type NumberStepperRowProps = {
    label: string;
    value: number;
    onChange: (val: number) => void;
    min?: number;
    max?: number;
};

export const NumberStepperRow = ({
    label,
    value,
    onChange,
    min = 0,
    max,
}: NumberStepperRowProps) => {
    const decrement = () => onChange(Math.max(min, value - 1));
    const increment = () =>
        onChange(max !== undefined ? Math.min(max, value + 1) : value + 1);

    return (
        <div className="flex items-center justify-between border-b border-stone-300 pb-1">
            <span className="text-stone-700 font-medium">{label}</span>
            <div className="flex items-center space-x-2">
                {label === "最終順位" ? (
                    <>
                        <button
                            type="button"
                            onClick={increment}
                            className="px-2 py-1 rounded-md bg-red-300 text-red-800 hover:bg-red-500 transition"
                        >
                            ↓
                        </button>
                        <span className="w-12 text-center font-bold">
                            {`${value} 位`}
                        </span>
                        <button
                            type="button"
                            onClick={decrement}
                            className="px-2 py-1 rounded-md bg-sky-400 text-white hover:bg-sky-600 transition"
                        >
                            ↑
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={decrement}
                            className="px-2 py-1 rounded-md bg-red-300 text-red-800 hover:bg-red-500 transition"
                        >
                            －
                        </button>
                        <span className="w-12 text-center font-bold">
                            {value}
                        </span>
                        <button
                            type="button"
                            onClick={increment}
                            className="px-2 py-1 rounded-md bg-sky-400 text-white hover:bg-sky-600 transition"
                        >
                            ＋
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
