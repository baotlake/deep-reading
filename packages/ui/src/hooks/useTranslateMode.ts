import { useEffect } from "react"

export default function useTranslateMode(setMode: (cardMode: boolean)=> void) {
    useEffect(()=>{
        function refreshMode() {
            if(window.innerWidth < 650) {
                setMode(true)
            }else {
                setMode(false)
            }
        }
        refreshMode()
        window.addEventListener('resize', refreshMode)
        return function () {
            window.removeEventListener('resize', refreshMode)
        }
    }, [])
}
