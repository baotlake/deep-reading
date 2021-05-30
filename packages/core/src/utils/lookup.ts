import { WrpWordData } from '../types/wrp'

export const iciba2wrp = (icibaData: any) => {
    let data: WrpWordData = { word: '' }
    let more = [];
    if (!icibaData.word_name) return {};
    data.word = icibaData.word_name;
    if (Object.keys(icibaData).includes('word_name')) {
        data.audio = icibaData.symbols[0].ph_tts_mp3;
        data.audioUK = icibaData.symbols[0].ph_en_mp3;
        data.audioUS = icibaData.symbols[0].ph_am_mp3;
        data.answer = icibaData.symbols[0].parts.map(
            (o: any) => [o.part, o.means.join(' ')]
        );
        // 提取单词解释里的单词
        more = icibaData.symbols[0].parts.map(
            (i: any) => i.means.join(' ')
        ).join(' ').match(/[a-zA-Z]{3,20}/);
    }
    return { data, more };
}