export default function Analytics() {
    return (
        <>
            {/* <!-- Global site tag (gtag.js) - Google Analytics -->*/}
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-F4DT269F2G" />
            <script dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', 'G-F4DT269F2G');`
            }}/>
        </>
    )
}
