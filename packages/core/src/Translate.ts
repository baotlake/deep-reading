import { translateApi } from './utils/request'

export default class Translate {
    public onTranslate: (data: any) => void

    private data: any

    constructor() {
        this.data = {
            original: '',
            translation: '',
        }
    }

    public async translate(text: string) {
        this.data = {
            original: text,
            translation: '',
        }
        this.onTranslate(this.data)

        const body = new URLSearchParams()
        body.append('text', text)

        let data = await translateApi(body)
        console.log('translate data', data)

        this.data.translation = data.Data.Translated
        this.onTranslate({ ...this.data })
    }

    static detectLang(text: string) {
        //
    }
}
