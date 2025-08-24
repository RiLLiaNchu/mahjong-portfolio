import { Game, GameStat, GameWithStats, Member } from "@/types/game";

type ScoreSheetRow = {
    label: string;
    [playerId: string]: number | string;
};

export function makeScoreSheetWithBonus(
    members: Member[],
    gamesWithStats: GameWithStats[],
    bonuses: Record<string, number> = {} // プレイヤーごとのボーナス
): ScoreSheetRow[] {
    // ゲームごとに分ける
    const gamesMap: Record<number, GameStat[]> = {};
    gamesWithStats.forEach((gs) => {
        if (!gamesMap[gs.game_number]) gamesMap[gs.game_number] = [];
        gamesMap[gs.game_number].push(...gs.stats);
    });

    // 最新スコア
    const latestScores: Record<string, number> = {};
    members.forEach((m) => {
        let latestScore = 0;
        // ゲームを逆順にして最新から
        for (let i = gamesWithStats.length - 1; i >= 0; i--) {
            const g = gamesWithStats[i];
            const stat = g.stats.find((s) => s.user_id === m.id);
            if (stat) {
                latestScore = stat.score;
                break;
            }
        }
        latestScores[m.id] = latestScore;
    });

    // 合計スコア
    const totalScores: Record<string, number> = {};
    members.forEach((m) => {
        totalScores[m.id] = gamesWithStats
            .flatMap((g) => g.stats)
            .filter((s) => s.user_id === m.id)
            .reduce((sum, s) => sum + s.score, 0);
    });

    // 合計スコア＋ボーナス
    const totalWithBonus: Record<string, number> = {};
    members.forEach((m) => {
        const bonus = bonuses[m.id] ?? 0;
        totalWithBonus[m.id] = totalScores[m.id] + bonus;
    });

    // 各ゲームごとのスコア
    const gameRows: ScoreSheetRow[] = Object.keys(gamesMap)
        .sort((a, b) => Number(a) - Number(b))
        .map((gameNumber) => {
            const row: ScoreSheetRow = { label: `${gameNumber}試合目` };
            members.forEach((m) => {
                const stat = gamesMap[Number(gameNumber)].find(
                    (g) => g.user_id === m.id
                );
                row[m.id] = stat ? stat.score : 0;
            });
            return row;
        });

    return [
        { label: "最新スコア", ...latestScores },
        { label: "合計スコア", ...totalScores },
        {
            label: "ボーナス",
            ...members.reduce((acc, m) => {
                acc[m.id] = bonuses[m.id] ?? 0;
                return acc;
            }, {} as Record<string, number>),
        },
        { label: "合計スコア＋ボーナス", ...totalWithBonus },
        ...gameRows,
    ];
}
