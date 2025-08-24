export type GameStats = {
    game_type: string;
    game_length: string;
    total_games: number;
    avg_rank: number;
    win_rate: number;
    second_rate: number;
    third_rate: number;
    fourth_rate: number;
    avg_score: number;
    total_score: number;
    agari_rate: number;
    avg_agari: number;
    deal_in_rate: number;
    avg_deal_in: number;
    riichi_rate: number;
    furo_rate: number;
    yakuman_count: number;
    double_yakuman_count: number;
};

// タブごとにデータを保持する形
export type StatsRecord = Record<string, GameStats[]>;
