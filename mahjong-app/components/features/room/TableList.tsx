// components/features/room/TableList.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { joinTable, TableWithMembers } from "@/lib/api/tables";
import { Profile, useAuth } from "@/contexts/auth-context";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";

type Props = {
    profile: Profile | null;
    tables: TableWithMembers[];
    roomId: string;
    onAddTable: () => void;
};

export const TableList: React.FC<Props> = ({
    profile,
    tables,
    roomId,
    onAddTable,
}) => {
    const router = useRouter();
    const { authUser, isGuest } = useAuth();
    const [selectedTable, setSelectedTable] = useState<TableWithMembers | null>(
        null
    );
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCardClick = (table: TableWithMembers) =>
        setSelectedTable(table);

    const handleJoinTable = async (table: TableWithMembers) => {
        setLoading(true);
        setError("");

        try {
            // ユーザーIDと名前を取得
            const userId = authUser?.id ?? crypto.randomUUID();

            await joinTable(table.id, userId);

            router.push(`/room/${roomId}/table/${table.id}`);
            setSelectedTable(null);
        } catch (err: any) {
            console.error("フロント卓参加エラー:", err);
            setError(err.message || "卓参加に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-blue-200 max-w-screen-lg mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                    🀄 卓一覧
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {tables.map((table) => (
                        <Card
                            key={table.id}
                            className="border rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
                            onClick={() => handleCardClick(table)}
                        >
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-gray-800">
                                    {table.name}
                                </CardTitle>
                            </CardHeader>
                            {/* <CardContent>
                                {table.members.length > 0 ? (
                                    <ul className="space-y-1 text-sm text-gray-700">
                                        {table.members.map((m) => (
                                            <li
                                                key={m.id}
                                                className="flex items-center gap-2"
                                            >
                                                <span className="text-green-600">
                                                    ●
                                                </span>
                                                {m.name}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-400 text-sm">
                                        メンバー未設定
                                    </p>
                                )}
                            </CardContent> */}
                        </Card>
                    ))}

                    <Button
                        onClick={onAddTable}
                        className="w-full py-8 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                    >
                        + 卓を追加
                    </Button>
                </div>

                {selectedTable && (
                    <Dialog
                        open={true}
                        onOpenChange={() => setSelectedTable(null)}
                    >
                        <DialogContent>
                            <DialogTitle>
                                {selectedTable.name} に参加しますか？
                            </DialogTitle>
                            <DialogDescription>
                                現在の卓からは退出します。
                            </DialogDescription>
                            {error && (
                                <p className="text-red-500 mt-2">{error}</p>
                            )}
                            <div className="flex justify-end gap-2 mt-4">
                                <Button
                                    onClick={() =>
                                        handleJoinTable(selectedTable)
                                    }
                                    disabled={loading}
                                >
                                    参加する
                                </Button>
                                <Button onClick={() => setSelectedTable(null)}>
                                    キャンセル
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </CardContent>
        </Card>
    );
};
