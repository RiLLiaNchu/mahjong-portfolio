export type Game = {
    id: string;
    table_id: string | null;
    game_number: number;
    played_at: string | null;
    created_at: string | null;
};

export type GameStat = {
    id?: string;
    game_id: string;
    user_id: string;
    rank: number;
    point: number;
    score: number;
    chip: number;
    agari_count: number;
    agari_total: number;
    deal_in_count: number;
    deal_in_total: number;
    riichi_count: number;
    furo_count: number;
    kyoku_count: number;
    yakuman_count: number;
    double_yakuman_count: number;
    created_at?: string;
    game_type: string; // "sanma" | "yonma"
    game_length: string; // "hanchan" | "tonpu"
};

export type GameStatsInput = {
    user_id: string;
    agari_count: number;
    agari_total: number;
    deal_in_count: number;
    deal_in_total: number;
    riichi_count: number;
    furo_count: number;
    kyoku_count: number;
    rank: number;
    point: number;
    score: number;
    chip: number;
    yakuman_count: number;
    double_yakuman_count: number;
};

export type Member = { id: string; name: string };

// スコアシートで1行分のデータ
export type ScoreSheetRow = {
    label: string; // 最新スコア, 合計スコア, ボーナス, 1試合目...
    values: Record<string, number>; // key = user_id, value =スコアやボーナス
};

// ボーナスだけ更新する時の型
export type BonusMap = Record<string, number>; // key = user_id

export type GameWithStats = Game & {
    stats: GameStat[];
};
