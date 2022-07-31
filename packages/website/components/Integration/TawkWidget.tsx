// <!--Start of Tawk.to Script-->
// <script type="text/javascript">
// var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
// (function(){
// var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
// s1.async=true;
// s1.src='https://embed.tawk.to/62616d74b0d10b6f3e6eb136/1g16974ve';
// s1.charset='UTF-8';
// s1.setAttribute('crossorigin','*');
// s0.parentNode.insertBefore(s1,s0);
// })();
// </script>
// <!--End of Tawk.to Script-->

import { useEffect } from "react"
import Script from "next/script"
import { matchChatVisiblePath } from "../../utils"

type Props = {
    path?: string
}

export function TawkWidget({ path }: Props) {

    useEffect(() => {
        const visible = matchChatVisiblePath(path)
        const tawkApi = window.Tawk_API
        const handleLoad = () => {
            if (tawkApi && tawkApi.showWidget && tawkApi.hideWidget) {
                visible ? tawkApi.showWidget() : tawkApi.hideWidget()
            }
        }

        handleLoad()
        if (tawkApi) {
            tawkApi.onLoad = handleLoad
        }

        return () => {
            if (tawkApi) {
                tawkApi.onLoad = null
            }
        }
    }, [path])

    return (
        <>
            <Script
                strategy="afterInteractive"
                type="text/javascript"
                dangerouslySetInnerHTML={{
                    __html: `
                        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                        (function(){
                        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                        s1.async=true;
                        s1.src='https://embed.tawk.to/62616d74b0d10b6f3e6eb136/1g16974ve';
                        s1.charset='UTF-8';
                        s1.setAttribute('crossorigin','*');
                        s0.parentNode.insertBefore(s1,s0);
                        })();
                    `
                }}
            ></Script>
        </>
    )
}