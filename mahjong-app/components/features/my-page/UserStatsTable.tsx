"use client";

import React from "react";

type GameStats = {
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

type Props = {
  stats: GameStats[];
};

export const UserStatsTable: React.FC<Props> = ({ stats }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-sm border border-gray-200">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            <th className="px-2 py-1 border">種別</th>
            <th className="px-2 py-1 border">長さ</th>
            <th className="px-2 py-1 border">対局数</th>
            <th className="px-2 py-1 border">平均順位</th>
            <th className="px-2 py-1 border">1位率</th>
            <th className="px-2 py-1 border">2位率</th>
            <th className="px-2 py-1 border">3位率</th>
            <th className="px-2 py-1 border">4位率</th>
            <th className="px-2 py-1 border">平均スコア</th>
            <th className="px-2 py-1 border">総スコア</th>
            <th className="px-2 py-1 border">和了率</th>
            <th className="px-2 py-1 border">平均和了点</th>
            <th className="px-2 py-1 border">放銃率</th>
            <th className="px-2 py-1 border">平均放銃点</th>
            <th className="px-2 py-1 border">立直率</th>
            <th className="px-2 py-1 border">副露率</th>
            <th className="px-2 py-1 border">役満回数</th>
            <th className="px-2 py-1 border">W役満回数</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s, idx) => (
            <tr key={idx} className="even:bg-gray-50">
              <td className="px-2 py-1 border">{s.game_type}</td>
              <td className="px-2 py-1 border">{s.game_length}</td>
              <td className="px-2 py-1 border">{s.total_games}</td>
              <td className="px-2 py-1 border">{s.avg_rank.toFixed(2)}</td>
              <td className="px-2 py-1 border">{(s.win_rate * 100).toFixed(1)}%</td>
              <td className="px-2 py-1 border">{(s.second_rate * 100).toFixed(1)}%</td>
              <td className="px-2 py-1 border">{(s.third_rate * 100).toFixed(1)}%</td>
              <td className="px-2 py-1 border">{(s.fourth_rate * 100).toFixed(1)}%</td>
              <td className="px-2 py-1 border">{s.avg_score.toFixed(1)}</td>
              <td className="px-2 py-1 border">{s.total_score.toFixed(0)}</td>
              <td className="px-2 py-1 border">{(s.agari_rate * 100).toFixed(1)}%</td>
              <td className="px-2 py-1 border">{s.avg_agari.toFixed(1)}</td>
              <td className="px-2 py-1 border">{(s.deal_in_rate * 100).toFixed(1)}%</td>
              <td className="px-2 py-1 border">{s.avg_deal_in.toFixed(1)}</td>
              <td className="px-2 py-1 border">{(s.riichi_rate * 100).toFixed(1)}%</td>
              <td className="px-2 py-1 border">{(s.furo_rate * 100).toFixed(1)}%</td>
              <td className="px-2 py-1 border">{s.yakuman_count}</td>
              <td className="px-2 py-1 border">{s.double_yakuman_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
