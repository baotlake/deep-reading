import { translateApi } from './utils/request'

export default class Translator {
    public onTranslate: (data: any) => void
    private data: any

    constructor() {
        this.onTranslate = () => { }
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
        this.onTranslate && this.onTranslate(this.data)

        const body = new URLSearchParams()
        body.append('text', text)

        let data = await translateApi(body)
        console.log('translate data', data)

        this.data.translation = data.Data.Translated
        this.onTranslate && this.onTranslate({ ...this.data })
    }

    static detectLang(text: string) {
        //
    }
}
