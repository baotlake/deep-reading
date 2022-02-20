import View from '../../components/View'

export default function ReadingPage(props: { hidden?: boolean }) {
    return (
        <div hidden={props.hidden !== false}>
            <View active={!props.hidden} />
        </div>
    )
}
