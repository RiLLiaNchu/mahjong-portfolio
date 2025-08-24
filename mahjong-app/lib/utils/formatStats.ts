import { GameStats, StatsRecord } from "@/types/mypage";

export function formatStats(data: GameStats[]): StatsRecord {
    const result: StatsRecord = {
        "yonma-hanchan": [],
        "yonma-tonpu": [],
        "sanma-hanchan": [],
        "sanma-tonpu": [],
    };

    // マッピング辞書
    const typeMap: Record<string, string> = {
        "4": "yonma",
        "3": "sanma",
        yonma: "yonma",
        sanma: "sanma",
    };

    const lengthMap: Record<string, string> = {
        "1": "tonpu",
        "2": "hanchan",
        tonpu: "tonpu",
        hanchan: "hanchan",
    };

    data.forEach((stat) => {
        const gameType = typeMap[stat.game_type] ?? stat.game_type;
        const gameLength = lengthMap[stat.game_length] ?? stat.game_length;

        const key = `${gameType}-${gameLength}` as keyof StatsRecord;

        if (key in result) {
            result[key].push(stat);
        } else {
            console.warn("Unknown key:", key, stat);
        }
    });

    return result;
}
