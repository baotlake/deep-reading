
阅读历史记录策略
    每次打开新页面就新增一条

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


读取阅读历史记录需求
- 最新n条
- 某个时间段的记录
- 某个host的记录





