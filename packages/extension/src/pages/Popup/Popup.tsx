import qr from '../../resource/images/netlify.png'

export default function Popup() {

    return (
        <div style={{width: 200, padding: 10}}>
            <h3>Deep Reading</h3>
            <p>beta版 （2021/10/17）</p>

            <p><b>手机平板</b>可用网页版</p>
            <img src={qr} width={150} height={150} style={{display: 'block', margin: "auto"}}/>
        </div>
    )
}
