// app/room/[id]/components/CreateTableDialog.tsx
import { useState } from "react";

interface CreateTableDialogProps {
    roomId: string; // roomId は必ず string
}

export default function CreateTableDialog({ roomId }: CreateTableDialogProps) {
    const [tableName, setTableName] = useState("");

    const handleCreate = async () => {
        console.log("作成する卓の roomId:", roomId);
        console.log("卓名:", tableName);
        // supabase insert などの処理を書く
    };

    return (
        <div>
            <h2>卓作成</h2>
            <input
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="卓名を入力"
            />
            <button onClick={handleCreate}>作成</button>
        </div>
    );
}
