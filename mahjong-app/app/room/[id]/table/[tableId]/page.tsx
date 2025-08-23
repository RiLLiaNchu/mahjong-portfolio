"use client";

import { useEffect, useState, use } from "react";
import {
    Clock,
    TableIcon,
    Users,
} from "lucide-react";
import { SeatDialog } from "@/components/features/table-page/SeatDialog";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import type { TablePlayer } from "@/types/table";
import { Header } from "@/components/ui/header";

type Table = {
    id: string;
    room_id: string;
    name: string;
    status: string;
    created_at: string;
};

type Game = {
    id: string;
    round_name: string;
    round_number: number;
    winner_id: string | null;
    loser_id: string | null;
    han: number | null;
    fu: number | null;
    score: number | null;
    is_draw: boolean;
    created_at: string;
};

export default function TablePage(props: {
    params: Promise<{ code: string; tableId: string }>;
}) {
    const { code, tableId } = use(props.params);
    const { authUser, profile, isGuest, isAdmin, refreshProfile } = useAuth();

    const [table, setTable] = useState<Table | null>(null);
    const [players, setPlayers] = useState<TablePlayer[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [selectedSeatPosition, setSelectedSeatPosition] = useState<
        string | null
    >(null);
    const [selectedPlayer, setSelectedPlayer] = useState<TablePlayer | null>(
        null
    );
    const [isSeatDialogOpen, setIsSeatDialogOpen] = useState(false);

    useEffect(() => {
        console.log("props.params:", props.params); // これで Promise の中身を確認
        console.log("tableId:", tableId); // tableId が正しく取れてるか確認

        // テーブルID が取れていない場合は読み込みしない
        if (!tableId) return;
        loadTableData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableId]);

    // テーブル・プレイヤー・ゲームデータをまとめて取得（APIコールを最小化）
    const loadTableData = async () => {
        setLoading(true);
        setError("");
        try {
            console.log("卓データ読み込み開始:", tableId);

            // 1) tables
            const { data: tableData, error: tableError } = await supabase
                .from("tables")
                .select("*")
                .eq("id", tableId)
                .single();

            if (tableError) {
                // 特定エラー処理（例）
                if ((tableError as any).code === "PGRST116") {
                    throw new Error("指定された卓は存在しません");
                }
                throw tableError;
            }
            setTable(tableData);

            // 2) table_members と users をリレーションで一回取得
            // supabase 側で foreign key が設定されている前提で `users(...)` のように取得できます
            const { data: playersData, error: playersError } = await supabase
                .from("table_members")
                .select("*, users(id, name, email)")
                .eq("table_id", tableId);

            if (playersError && (playersError as any).code !== "42P01") {
                throw playersError;
            }
            setPlayers((playersData as TablePlayer[]) || []);

            // 3) games（直近10件）
            const { data: gamesData, error: gamesError } = await supabase
                .from("games")
                .select("*")
                .eq("table_id", tableId)
                .order("created_at", { ascending: false })
                .limit(10);

            if (gamesError && (gamesError as any).code !== "42P01") {
                throw gamesError;
            }
            setGames(gamesData || []);
        } catch (err: any) {
            console.error("卓データ読み込みエラー:", err);
            setError(err?.message || "卓情報の取得に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    // 着席
    const handleSit = async () => {
    };

    // クリックでモーダル開くハンドラ（Empty と Player 両方から呼ぶ）
    const openSeatDialog = (pos: string, player: TablePlayer | null) => {
        setSelectedSeatPosition(pos);
        setSelectedPlayer(player ?? null);
        setIsSeatDialogOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            {table ? (
                <Header
                    backHref={`/room/${table.room_id}`}
                    icon={<TableIcon className="text-green-600" />}
                    title={
                        <div className="flex flex-col leading-tight">
                            <span className="text-base sm:text-lg font-bold">
                                卓A
                            </span>
                            {/* アイコン付きルール表示 */}
                            <div className="flex gap-3 text-xs text-gray-600 mt-1">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    東風
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4 text-green-500" />
                                    四人
                                </div>
                            </div>
                        </div>
                    }
                    status={{ text: "対局中", variant: "secondary" }}
                />
            ) : (
                <Header
                    backHref="#"
                    icon={<TableIcon className="text-gray-400" />}
                    title={
                        <span className="text-base sm:text-lg font-bold">
                            読み込み中…
                        </span>
                    }
                    status={{ text: "読み込み中", variant: "secondary" }}
                />
            )}

            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* 卓のUI */}
                <div className="relative w-64 h-64 mx-auto bg-green-700 rounded-xl shadow-lg flex items-center justify-center">
                    <span className="text-white text-2xl">🀄</span>

                    {["東", "南", "西", "北"].map((pos) => {
                        // players からこのポジションに座っている人を探す
                        const player = players.find((p) => p.position === pos);
                        const displayName = player?.name ?? "空席";

                        // 位置クラスを方角ごとに設定
                        let posClass = "";
                        if (pos === "東")
                            posClass =
                                "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2";
                        if (pos === "南")
                            posClass =
                                "right-0 top-1/2 -translate-y-1/2 translate-x-1/2";
                        if (pos === "西")
                            posClass =
                                "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2";
                        if (pos === "北")
                            posClass =
                                "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2";

                        return (
                            <div key={pos} className={`absolute ${posClass}`}>
                                <button
                                    className="bg-white border shadow rounded-full px-4 py-2"
                                    onClick={() => openSeatDialog(pos, player)}
                                >
                                    {displayName}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* 戦績入力ボタン */}
                <div className="mt-8">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg shadow text-lg">
                        戦績を入力
                    </button>
                </div>
                {error && <div className="text-red-600 mt-2">{error}</div>}

                <SeatDialog
                    open={isSeatDialogOpen}
                    onClose={() => setIsSeatDialogOpen(false)}
                    position={selectedSeatPosition}
                    player={selectedPlayer}
                    onSit={() => handleSit()} // 自分が着席
                    onAddBot={() => handleAddBot()} // BOT着席
                    onLeave={() => handleLeave()}
                    players={players}
                    currentUserId={authUser?.id ?? null}
                />
            </div>
        </div>
    );
}
