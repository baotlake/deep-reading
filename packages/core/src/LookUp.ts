
import { lookUpApi } from './utils/request'


interface Data {
    word: string,

}

export default class LookUp {
    public onExplain: (data: any) => void

    private data: any

    constructor() {

    }

    public async lookUp(word: string) {
        this.data = {
            word: word,
            answer: [],
            audioUS: '',
            audioUK: '',
            audio: '',
        }

        this.onExplain(this.data)

        this.data = await lookUpApi(word)
        console.log('data', this.data)

        this.onExplain(this.data)


    }
    


}
