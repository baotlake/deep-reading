import { translateApi } from './utils/request'

type Data = {
    original: string
    translation: string
}

export class Translator {
    constructor() {
    }

    public async translate(text: string) {
        const body = new URLSearchParams()
        body.append('text', text)

        const data = await translateApi(body)
        console.log('translate data', data)
        
        return {
            original: text,
            translated: data.Data.Translated
        }
    }

    static detectLang(text: string) {
        //
    }
}
