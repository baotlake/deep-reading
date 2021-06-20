import { lookUpApi } from './utils/request'

type Definition = [string, string]
export interface WordData {
    word: string
    pronunciation: {
        symbol_am: string
        symbol_en: string
        symobl_other: string
        audio_am: string
        audio_en: string
        audio_other: string
    }
    answer: Definition[]
    star: boolean
    state: 'loading' | 'done' | 'fail'
}

export default class LookUp {
    public onExplain: (data: WordData) => void

    private data: WordData

    constructor() {}

    public async lookUp(word: string) {
        if (!word) return
        this.data = {
            word: word,
            answer: [],
            pronunciation: {
                symbol_am: '',
                symbol_en: '',
                symobl_other: '',
                audio_am: '',
                audio_en: '',
                audio_other: '',
            },
            star: undefined,
            state: 'loading',
        }

        this.onExplain({ ...this.data })

        let { data: apiData } = await lookUpApi(word)
        let success = !!apiData.answer
        if (success) {
            this.data.pronunciation = {
                symbol_am: apiData.ph_am,
                symbol_en: apiData.ph_en,
                symobl_other: apiData.ph_other,
                audio_am: apiData.audioUS,
                audio_en: apiData.audioUK,
                audio_other: apiData.audio,
            }
            this.data.answer = apiData.answer
            this.data.state = 'done'
        }

        if (!success) {
            this.data.state = 'fail'
        }
        console.log('data', this.data)

        this.onExplain({ ...this.data })
    }
}
