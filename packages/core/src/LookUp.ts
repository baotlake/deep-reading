import { lookUpApi } from './utils/request'

interface Data {
    word: string

    pronunciation: {}
}

export default class LookUp {
    public onExplain: (data: any) => void

    private data: any

    constructor() {}

    public async lookUp(word: string) {
        this.data = {
            word: word,
            answer: [],
            audioUS: '',
            audioUK: '',
            audio: '',
        }

        this.onExplain(this.data)

        let { data } = await lookUpApi(word)
        this.data = data
        console.log('data', this.data)

        this.onExplain(this.data)
    }
}
