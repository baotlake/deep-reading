

type Definition = [string, string]
export interface WordData {
    word: string
    pronunciation: {
        symbol_am: string
        symbol_en: string
        symbol_other: string
        audio_am: string
        audio_en: string
        audio_other: string
    }
    answer: Definition[]
    star: boolean
    timestamp: number
}
