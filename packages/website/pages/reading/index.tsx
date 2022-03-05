import View from '../../components/View'

export default function ReadingPage(props: { active?: boolean }) {
    return (
        <div hidden={props.active === false}>
            <View active={props.active} />
        </div>
    )
}
