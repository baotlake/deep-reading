import { recommended } from "./recommended"
import { computerDocs } from "./computerDocs"
import { news } from "./news"
import { music } from './music'
import { gettingStarted } from "./gettingStarted"
import {
    textbook,
    classicNovel,
    politicalFinance,
    history,
    sports,
} from './other'

import { navigation } from './navigation'

export const exploreData = {
    recommended: recommended,
    technicalDocuments: computerDocs,
    news: news,
    music: music,
    gettingStarted: gettingStarted,
    textbook: textbook,
    classicNovel: classicNovel,
    politicalFinance: politicalFinance,
    history: history,
    sports: sports,
}

export {
    navigation as navigationData,
}