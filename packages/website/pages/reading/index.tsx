import { memo } from 'react'
import View from '../../components/View'
import Reading from '../../components/Reading'

export default function ReadingPage(props: { hidden?: boolean }) {
    return (
        <div hidden={props.hidden !== false}>
            <View />
            <Reading />
        </div>
    )
}
