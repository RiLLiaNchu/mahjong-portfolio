"use client";

import { RoomMember } from "@/lib/api/getRoomMembers";

interface MemberListProps {
    members: RoomMember[];
}

export default function MemberList({ members }: MemberListProps) {
    return (
        <ul>
            {members.map((m) => (
                <li key={m.id}>
                    {m.user.name} ({m.user.email ?? "メールなし"})
                </li>
            ))}
        </ul>
    );
}
