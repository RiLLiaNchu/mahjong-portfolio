"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserStatsTable } from "./UserStatsTable";
import { StatsRecord } from "@/types/mypage";

type Props = {
    stats: StatsRecord;
};

export function UserStatsTabs({ stats }: Props) {
    return (
        <Tabs defaultValue="yonma-hanchan" className="w-full pb-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full mb-12 md:mb-4 bg-rose-50 rounded-xl p-1 shadow-inner">
                <TabsTrigger
                    value="yonma-hanchan"
                    className="bg-white hover:bg-rose-100 rounded-lg shadow-sm"
                >
                    四麻 半荘
                </TabsTrigger>
                <TabsTrigger
                    value="yonma-tonpu"
                    className="bg-white hover:bg-rose-100 rounded-lg shadow-sm"
                >
                    四麻 東風
                </TabsTrigger>
                <TabsTrigger
                    value="sanma-hanchan"
                    className="bg-white hover:bg-rose-100 rounded-lg shadow-sm"
                >
                    三麻 半荘
                </TabsTrigger>
                <TabsTrigger
                    value="sanma-tonpu"
                    className="bg-white hover:bg-rose-100 rounded-lg shadow-sm"
                >
                    三麻 東風
                </TabsTrigger>
            </TabsList>

            {Object.entries(stats).map(([key, data]) => (
                <TabsContent
                    key={key}
                    value={key}
                    className="bg-rose-50 p-4 rounded-xl shadow-md"
                >
                    {data?.length ? (
                        <UserStatsTable stats={data} />
                    ) : (
                        <p className="text-sm text-gray-500 text-center">
                            対局してデータを集めよう
                        </p>
                    )}
                </TabsContent>
            ))}
        </Tabs>
    );
}
