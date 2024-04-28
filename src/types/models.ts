export interface ModelConfig {
    name: string;
    model_id: string;
    fucntion_call: boolean;
    provider: string;
    vision?: boolean;
    type: "chat" | "embedding";
    context_size?: number;
}

export interface Model extends ModelConfig {
    createdAt: string;
    hidden: boolean;
}