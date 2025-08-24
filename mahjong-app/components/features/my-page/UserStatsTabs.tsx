"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserStatsTable } from "./UserStatsTable";
import { StatsRecord } from "@/types/mypage";

type Props = {
    stats: StatsRecord;
};

export function UserStatsTabs({ stats }: Props) {
    return (
        <Tabs defaultValue="yonma-hanchan" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full mb-12">
                <TabsTrigger value="yonma-hanchan">四麻 半荘</TabsTrigger>
                <TabsTrigger value="yonma-tonpu">四麻 東風</TabsTrigger>
                <TabsTrigger value="sanma-hanchan">三麻 半荘</TabsTrigger>
                <TabsTrigger value="sanma-tonpu">三麻 東風</TabsTrigger>
            </TabsList>

            <TabsContent value="yonma-hanchan">
                {stats["yonma-hanchan"]?.length ? (
                    <UserStatsTable stats={stats["yonma-hanchan"]!} />
                ) : (
                    <p className="text-sm text-gray-500">データがありません</p>
                )}
            </TabsContent>

            <TabsContent value="yonma-tonpu">
                {stats["yonma-tonpu"] ? (
                    <UserStatsTable stats={stats["yonma-tonpu"]!} />
                ) : (
                    <p className="text-sm text-gray-500">データがありません</p>
                )}
            </TabsContent>

            <TabsContent value="sanma-hanchan">
                {stats["sanma-hanchan"] ? (
                    <UserStatsTable stats={stats["sanma-hanchan"]!} />
                ) : (
                    <p className="text-sm text-gray-500">データがありません</p>
                )}
            </TabsContent>

            <TabsContent value="sanma-tonpu">
                {stats["sanma-tonpu"] ? (
                    <UserStatsTable stats={stats["sanma-tonpu"]!} />
                ) : (
                    <p className="text-sm text-gray-500">データがありません</p>
                )}
            </TabsContent>
        </Tabs>
    );
}
