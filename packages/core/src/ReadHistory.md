
```Typescript
interface HistoryItem {
    href: string        // page url
    title: string       // page title
    icon: string        // page favicon
    description: string // page description
    scrollXY: [number, number]  // page scroll position
    createdAt: number   // 首次打开时间戳
    updatedAt: number   // 最后阅读时间戳
    time: number        // 有效阅读时间
}
```