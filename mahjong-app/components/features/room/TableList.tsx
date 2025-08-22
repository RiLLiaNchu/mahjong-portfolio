"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type Table = {
    id: string;
    name: string; // 卓A, 卓B
    members: { id: string; name: string }[];
};

export const TableList = ({
    tables,
    onAddTable,
}: {
    tables: Table[];
    onAddTable: () => void;
}) => {
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
                            className="border rounded-xl shadow-sm hover:shadow-md transition"
                        >
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-gray-800">
                                    {table.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
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
                            </CardContent>
                        </Card>
                    ))}

                    {/* 卓追加ボタン */}
                    <Button
                        onClick={onAddTable}
                        className="w-full py-8 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                    >
                        + 卓を追加
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
