export function formatStats(rawStats: any[]) {
    const result: Record<string, any> = {
        "yonma-hanchan": null,
        "yonma-tonpu": null,
        "sanma-hanchan": null,
        "sanma-tonpu": null,
    };

    rawStats.forEach((stat) => {
        const key = `${stat.game_type}-${stat.game_length}`; // 例: "yonma-hanchan"
        result[key] = stat;
    });

    return result;
}
