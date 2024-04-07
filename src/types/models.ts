export interface ModelConfig {
    name: string;
    model_id: string;
    fucntion_call: boolean;
    provider: string;
    vision?: boolean;
    type: "chat" | "embedding";
}

export interface Model extends ModelConfig {
    createdAt: string;
    hidden: boolean;
}