export type AiProvider = {
    key: string
    name: string
    apiKey: string
    baseUrl?: string
    headers?: Record<string, string>
    createdAt: number
}

export const AVAILABLE_PROVIDERS = [
    "fireworks",
    "openai",
    "anthropic",
    "google",
    "groq",
    "local",
    "openrouter",
    "together"
] as const


export class DialoqAiProviders {
    db: chrome.storage.StorageArea

    constructor() {
        this.db = chrome.storage.local
    }


    async getProviders(): Promise<AiProvider[]> {
        return new Promise((resolve, reject) => {
            this.db.get("providers", (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve(result.providers || [])
                }
            })
        })
    }

    async getProviderByKey(key: string): Promise<AiProvider | undefined> {
        const providers = await this.getProviders()
        return providers.find((p) => p.key === key)
    }

    async setProviders(providers: AiProvider[]): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.set({ providers }, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve()
                }
            })
        })
    }



    async addProvider(provider: AiProvider): Promise<void> {
        const providers = await this.getProviders()
        providers.push(provider)
        return this.setProviders(providers)
    }


    async updateProvider(key: string, provider: AiProvider): Promise<void> {
        const providers = await this.getProviders()
        const index = providers.findIndex((p) => p.key === key)
        providers[index] = provider
        return this.setProviders(providers)
    }


    async deleteProvider(key: string): Promise<void> {
        const providers = await this.getProviders()
        const index = providers.findIndex((p) => p.key === key)
        providers.splice(index, 1)
        return this.setProviders(providers)
    }

    async upsertProvider(provider: AiProvider): Promise<void> {
        const providers = await this.getProviders()
        const index = providers.findIndex((p) => p.key === provider.key)
        if (index === -1) {
            providers.push(provider)
        } else {
            providers[index] = provider
        }
        return this.setProviders(providers)
    }

}


export const getAllProviders = async () => {
    const db = new DialoqAiProviders()
    const data = await db.getProviders()

    const result = data.reduce((acc, provider) => {
        acc[provider.key] = provider
        return acc
    }, {} as Record<typeof AVAILABLE_PROVIDERS[number], AiProvider>)

    return result
}


export const updateProvider = async (key: typeof AVAILABLE_PROVIDERS[number], provider: AiProvider): Promise<void> => {
    const db = new DialoqAiProviders()
    await db.updateProvider(key, provider)
}

export const upsertProvider = async (provider: {
    key: typeof AVAILABLE_PROVIDERS[number]
    name: string
    apiKey: string
    baseUrl?: string
    headers?: Record<string, string>
}): Promise<void> => {
    const db = new DialoqAiProviders()
    await db.upsertProvider({
        ...provider,
        createdAt: Date.now()
    })
}

export const getProvider = async (key: typeof AVAILABLE_PROVIDERS[number]): Promise<AiProvider | undefined> => {
    const db = new DialoqAiProviders()
    const providers = await db.getProviders()
    return providers.find((p) => p.key === key)
}

export const  getProviderByKey = async (key: string): Promise<AiProvider | undefined> => {
    const db = new DialoqAiProviders()
    return db.getProviderByKey(key)
}