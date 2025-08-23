export type UserMin = {
    id: string;
    name: string;
    email: string;
};

export type TablePlayer = {
    id: string;
    user_id: string;
    name: string;
    position: string;
    is_seated: boolean;
    users?: { name: string } | null;
};
