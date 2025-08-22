import { supabase } from "../supabase";

export const submitGameStats = async (
    gameId: string,
    userId: string,
    stats: {
        rank: number;
        score: number;
        winCount: number;
    }
) => {
    await supabase.from("game_stats").insert({
        game_id: gameId,
        user_id: userId,
        ...stats,
    });
    return true;
};
