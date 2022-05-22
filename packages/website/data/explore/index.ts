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
    recommended: recommended.list,
    technicalDocuments: computerDocs.list,
    news: news.list,
    music: music.list,
    gettingStarted: gettingStarted.list,
    textbook: textbook.list,
    classicNovel: classicNovel.list,
    politicalFinance: politicalFinance.list,
    history: history.list,
    sports: sports.list,
}

export {
    navigation as navigationData,
}