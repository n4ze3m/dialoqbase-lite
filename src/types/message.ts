type WebSearch = {
    search_engine: string
    search_url: string
    search_query: string
    search_results: {
      title: string
      link: string
    }[]
  }
  export type Message = {
    id?: string
    isBot: boolean
    name: string
    message: string
    sources: any[]
    images?: string[]
    search?: WebSearch
  }