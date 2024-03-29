export interface ModelConfig {
    name: string;
    model_id: string;
    fucntion_call: boolean;
    provider: string;
    vision?: boolean;
}

export interface Model extends ModelConfig {
    createdAt: string;
    hidden: boolean;
}