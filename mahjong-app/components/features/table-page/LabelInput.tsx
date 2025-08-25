type NumberRowProps = {
    label: string;
    value: number;
    onChange: (val: number) => void;
    step?: number;
    suggestions?: number[];
    withAddButton?: boolean; // +ボタンをつけるか
    addAction?: () => void;
    total?: number;
};

export const NumberRow = ({
    label,
    value,
    onChange,
    step,
    suggestions,
    withAddButton,
    addAction,
    total,
}: NumberRowProps) => (
    <div className="flex items-center justify-between border-b border-stone-300 pb-1">
        <span className="text-stone-700 font-medium">{label}</span>
        <div className="flex items-center space-x-2">
            <input
                type="number"
                step={step}
                value={value}
                onChange={(e) => onChange(+e.target.value)}
                list={suggestions ? "suggestions" : undefined}
                className="w-24 text-right px-2 py-1 rounded-md border border-stone-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-stone-50"
            />
            {withAddButton && addAction && (
                <button
                    type="button"
                    onClick={addAction}
                    className="px-2 py-1 rounded-md bg-sky-400 text-white hover:bg-red-700 transition"
                >
                    →
                </button>
            )}
            {suggestions && (
                <datalist id="suggestions">
                    {suggestions.map((val) => (
                        <option key={val} value={val} />
                    ))}
                </datalist>
            )}
            {(label === "和了点" || label === "放銃点") && (
                <span className="font-bold text-stone-800">
                    計 {total ?? 0} 点
                </span>
            )}
        </div>
    </div>
);
