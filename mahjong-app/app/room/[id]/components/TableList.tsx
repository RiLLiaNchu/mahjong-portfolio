"use client";

import { Table } from "@/lib/api/getTables";

interface TableListProps {
    tables: Table[];
}

export default function TableList({ tables }: TableListProps) {
    if (tables.length === 0) return <div>卓はまだありません</div>;

    return (
        <ul>
            {tables.map((t) => (
                <li key={t.id}>
                    {t.name} - {t.game_type} {t.players.length}人
                </li>
            ))}
        </ul>
    );
}
