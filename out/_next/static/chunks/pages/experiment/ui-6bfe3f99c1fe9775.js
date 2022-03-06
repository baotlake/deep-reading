(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[693],{5172:function(e,t,i){(window.__NEXT_P=window.__NEXT_P||[]).push(["/experiment/ui",function(){return i(343)}])},343:function(e,t,i){"use strict";i.r(t),i.d(t,{default:function(){return N}});var o=i(2322),n=i(2784);function r({ratioX:e,direction:t}){const i=255;let n=(()=>{let t=e*i;if(t<19)return 19;return t>236?236:t})(),r=(()=>{let t=e*i;return t=n+.6*(t-n),t})();return(0,o.jsx)("svg",{viewBox:"-15 -15 285 210",children:(0,o.jsx)("path",{d:"down"===t?`M6,30 L${n-13},30 L${r},12 L${n+13},30 L249,30 a6 6 90 0 1 6,6 L255,36 L255,144 a6 6 90 0 1 -6,6 L249,150 L6,150 a6 6 90 0 1 -6,-6 L0,144 L0,36 a6,6,90,0,1,6,-6 Z`:`M6,30 L249,30 a6 6 90 0 1 6,6 L255,36 L255,144 a6 6 90 0 1 -6,6 L249,150 L${n+13},150 L${r},168 L${n-13},150 L6,150 a6 6 90 0 1 -6,-6 L0,144 L0,36 a6,6,90,0,1,6,-6 Z`,stroke:"rgba(0,0,0,0.2)",strokeWidth:"0.5",fill:"white"},void 0)},void 0)}var s=i(9206),a=i(6798),d=i(6769);const l=(0,d.Z)(s.Z)`
    font-size: ${12/14+"em"};
    display: inline-flex;
    margin-right: ${10/12+"em"};
    align-items: center;
    height: ${20/12+"em"};
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    padding: 0 ${5/12+"em"};
    margin-left: ${-5/12+"em"};
    border-radius: ${2/12+"em"};
    outline: none;
    border: none;
    vertical-align: middle;
`;function c({data:e,overridePlay:t}){e||(e={});const i=i=>{if(t)return t(i);const o="am"===i?e.audio_am:"en"===i?e.audio_en:e.audio_other;new Audio(o).play()};return(0,o.jsxs)(o.Fragment,{children:[e.audio_am&&(0,o.jsxs)(l,{hidden:!e.audio_am,onClick:()=>i("am"),children:[(0,o.jsx)("span",{children:"\u7f8e"},void 0),(0,o.jsx)("span",{children:e.symbol_am&&`/${e.symbol_en}/`},void 0),(0,o.jsx)(a.Z,{fontSize:"small",sx:{fontSize:20/12+"em"}},void 0)]},void 0),e.audio_en&&(0,o.jsxs)(l,{onClick:()=>i("en"),children:[(0,o.jsx)("span",{children:"\u82f1"},void 0),(0,o.jsx)("span",{children:e.symbol_en&&`/${e.symbol_en}/`},void 0),(0,o.jsx)(a.Z,{fontSize:"small",sx:{fontSize:20/12+"em"}},void 0)]},void 0),!e.audio_am&&!e.audio_en&&e.audio_other&&(0,o.jsxs)(l,{onClick:()=>i("other"),children:[(0,o.jsx)("span",{children:e.symbol_other&&`/${e.symbol_other?.replace("http://res-tts.iciba.com","")}/`},void 0),(0,o.jsx)(a.Z,{fontSize:"small",sx:{fontSize:20/12+"em"}},void 0)]},void 0)]},void 0)}function h({answer:e}){return e?(0,o.jsx)(o.Fragment,{children:e.map(((e,t)=>(0,o.jsxs)("dt",{children:[(0,o.jsx)("b",{children:e[0]},void 0),e[1]]},t)))},void 0):(0,o.jsx)(o.Fragment,{},void 0)}var u=i(2779),m=i.n(u),p=i(9906),v=i(7705);const x=d.Z.div`
    width: ${"15.9375em"};
    height: ${"7.5em"};
    top: 100px;
    left: 100px;
    position: absolute;

    &.hidden {
        opacity: 0;
        pointer-events: none;
    }
`,f=d.Z.div`
    position: absolute;
    width: 100%;
    height: 100%;
    padding: ${"2.8125em"} ${"0.9375em"};
    top: 50%;
    left: 50%;
    box-sizing: content-box;
    transform: translate(-50%, -50%);
    pointer-events: none;
    filter: drop-shadow(0 0 ${"0.625em"} rgba(0,0,0,0.2));

    > svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        path {
            transition: all 0.2s;
        }
    }
`,b=d.Z.div`
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    box-sizing: border-box;
    border: 1px solid transparent;
    // height: calc(100% - 2px);
    // width: calc(100% - 2px);
    // top: 1px;
    // left: 1px;

    &::after {
      content: ' ';
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 1;
      border-radius: ${"0.5em"};
      box-shadow: inset 0 0 ${"0.5em"} ${"0.625em"} white;
      pointer-events: none;
      display: block;
      position: absolute;
    }
`,g=d.Z.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    position: relative;
    z-index: 1;
    padding: ${"0.625em"};
    box-sizing: border-box;

    &::-webkit-scrollbar {
      display: none;
    }
`,w=d.Z.div`
    box-sizing: border-box;

      .word {
        line-height: 1.3;
        font-size: ${"1.125em"};
        font-weight: 700;
      }
`,$=d.Z.div`
  dl {
    font-size: ${"0.875em"};
    margin: ${5/14+"em"} 0 0;
    line-height: 1.6;
    font-weight: normal;

    b {
      font-weight: 700;
      margin-right: 5px;
    }
  }
`,j=d.Z.div`
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  width: ${"1.25em"};
  height: ${"1.25em"};
  padding: ${"0.625em"};
  margin: ${-5/16+"em"};
  color: #5a5a5a;
  cursor: pointer;
  box-sizing: content-box;
  -webkit-tap-highlight-color: transparent;
`;var y=(0,n.forwardRef)((function({visible:e,data:t,status:i,position:s,onClose:a,zoom:d,overridePlay:l},u){t||(t={});const y=(0,n.useRef)(null),k=function(e,t){const[i,o]=(0,n.useState)({left:100,top:100,rx:.5,direction:"up"});return(0,n.useEffect)((()=>{const i=255,n=120,r=30,s=15;t&&o((()=>{const o=t[0],a=t[1],d=e.current?.getBoundingClientRect(),l=d?.width||i,c=d?.height||n,h=window.innerWidth,u=(d?.width||i)/i,m=u*r,p=u*s;let v=.5,x=o-l/2;o<p+l/2&&(v=(o-p)/l,x=p),o>h-p-l/2&&(v=1-(h-o-p)/l,x=h-p-l);let f="up",b=a-c-m;return a<c+p+m&&(f="down",b=a+m),{left:x,top:b,rx:v,direction:f}})())}),[t]),i}(y,s);(0,n.useEffect)((()=>{y.current&&("function"===typeof u?u(y.current):null!==u&&(u.current=y.current))}),[u]);const L=(0,n.useCallback)((e=>{const i={am:t.pronunciation?.audio_am,en:t.pronunciation?.audio_en,other:t.pronunciation?.audio_other}[e]||"";l&&l({word:t.word||"",url:i,type:e})}),[t]);return(0,o.jsxs)(x,{ref:y,className:m()("wrp-explanation",k.direction,{hidden:!e}),style:{left:k.left,top:k.top},"data-wrp-action":"no-tapBlank no-lookup no-translate",children:[(0,o.jsx)(f,{className:"border-box",children:(0,o.jsx)(r,{ratioX:k.rx,direction:k.direction},void 0)},void 0),(0,o.jsx)(b,{className:"main",children:(0,o.jsxs)(g,{className:"container",children:[(0,o.jsx)(w,{className:"header",children:(0,o.jsx)("div",{className:"word",children:t.word},void 0)},void 0),(0,o.jsx)($,{className:"content",children:(0,o.jsxs)("dl",{children:["loading"===i&&(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(p.Z,{variant:"text",width:"60%",height:22},void 0),(0,o.jsx)(p.Z,{variant:"text",width:"40%",height:22},void 0),(0,o.jsx)(p.Z,{variant:"text",width:"80%",height:22},void 0)]},void 0),"success"===i&&(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("dt",{children:(0,o.jsx)(c,{overridePlay:l&&L,data:t.pronunciation||{}},void 0)},void 0),(0,o.jsx)(h,{answer:t.answer||[]},void 0)]},void 0)]},void 0)},void 0)]},void 0)},void 0),(0,o.jsx)(j,{role:"button",className:"close",onClick:()=>a&&a(),children:(0,o.jsx)(v.Z,{fontSize:"small",sx:{fontSize:"1.25em"}},void 0)},void 0)]},void 0)}));function k({position:e,size:t,color:i}){return t=t||4,i=i||"red",(0,o.jsx)("div",{style:{position:"absolute",left:e[0],top:e[1],width:t,height:t,transform:`translate(-${t/2}px, -${t/2}px)`,backgroundColor:i}},void 0)}const L=120,_=d.Z.div`
  pointer-events: all;
  background-color: rgba(255, 255, 255, 1);
  width: 100%;
  height: 80vh;
  position: fixed;
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: ${"1.875em"} ${"1.875em"} 0 0;
  box-shadow: 0px 0px ${"0.625em"} rgba(0, 0, 0, 0.2);
  padding: ${"1.875em"};
  box-sizing: border-box;
  top: ${"calc(100vh + 120px )"};
  overscroll-behavior: none;
`,z=d.Z.div`
  position: absolute;
  width: ${"2.875em"}; 
  box-sizing: border-box;
  top: ${"0.625em"};
  left: 50%;
  transform: translateX(-50%);

  > div {
    background-color: #eaeaea;
    display: block;
    width: 100%;
    height: ${"0.25em"};
    border-radius: ${"0.125em"};
  }
`;var E=(0,n.forwardRef)((function({visible:e,data:t,onClose:i},r){const s=(0,n.useRef)(null),a=e=>{const t=s.current;t&&(t.style.transition="all 0.3s",t.style.transform=`translateY(${e}px)`,setTimeout((()=>{t.style.transition=""}),300))};return function({target:e,bottom:t,onStop:i}){const o=(0,n.useRef)({startY:0,startTranslateY:0,startAt:0,moving:!1,moveSpeed:0,height:0,lastY:0,lastAt:0,translateY:0,speed:0});(0,n.useEffect)((()=>{if(!e)return;const n=t=>{e.style.transform=`translateY(${t}px)`},r=t=>{const i=t instanceof TouchEvent?t.touches[0].screenY:t.screenY,n=parseFloat(e.style.transform.slice(11,-3)||"0"),r=e.getBoundingClientRect(),s=o.current;s.startY=i,s.lastY=i,s.lastAt=t.timeStamp,s.startTranslateY=n,s.translateY=n,s.moving=!0,s.startAt=t.timeStamp,s.height=r.height,s.speed=0},s=e=>{e.preventDefault();const i=e instanceof TouchEvent?e.touches[0].screenY:e.screenY,{moving:r,startY:s,startTranslateY:a,lastAt:d,lastY:l,height:c}=o.current;if(r){const r=i-s+a;if(r>t||r<-c-t)return void(o.current.moving=!1);n(r),o.current.translateY=r,o.current.lastY=i,o.current.lastAt=e.timeStamp,o.current.speed=(i-l)/(e.timeStamp-d)}},a=e=>{const{moving:t,speed:i}=o.current;t&&(o.current.moving=!1,d(i),console.log("speed",i))},d=e=>{const r=Date.now(),s=()=>{const{moving:a,translateY:d,height:l}=o.current,c=Date.now()-r;let h=e-.006*Math.sign(e)*c,u=d+c*(e+h)/2;const m=u>t||u<-l-t,p=Math.sign(h)!==Math.sign(e)||Math.abs(e)<.006;if(console.log("inertiaMove: ",u,e,h,p),!a&&!p&&!m)return n(u),window.requestAnimationFrame(s);(p||m)&&i&&i(l,u)};s()};return e.addEventListener("touchstart",r,{passive:!1}),e.addEventListener("touchmove",s,{passive:!1}),e.addEventListener("touchend",a,{passive:!1}),e.addEventListener("mousedown",r),e.addEventListener("mousemove",s),e.addEventListener("mouseup",a),()=>{e.removeEventListener("touchstart",r),e.removeEventListener("touchmove",s),e.removeEventListener("touchend",a),e.removeEventListener("mousedown",r),e.removeEventListener("mousemove",s),e.removeEventListener("mouseup",a)}}),[e])}({target:s.current,bottom:L,onStop:(e,t)=>{console.log("handleScrollStop");s.current&&t>(-e-L)/3&&(a(0),i&&i())}}),(0,n.useEffect)((()=>{const t=s.current;if(t&&!0===e){let e=t.getBoundingClientRect();a((-e.height-L)/1.5)}!1===e&&a(0)}),[e]),(0,n.useEffect)((()=>{"function"===typeof r?r(s.current):null!==r&&(r.current=s.current)}),[r]),(0,o.jsx)(o.Fragment,{children:(0,o.jsxs)(_,{ref:s,className:m()("wrp-translation",{visible:e}),"data-wrp-action":"no-tapBlank no-translate no-lookup",children:[(0,o.jsx)(z,{children:(0,o.jsx)("div",{},void 0)},void 0),(0,o.jsx)("div",{className:"","data-wrp-action":"lookup",children:t?.original},void 0),(0,o.jsx)("br",{},void 0),(0,o.jsx)("div",{className:"",children:t?.translated},void 0)]},void 0)},void 0)}));const Z=d.Z.div`
  position: fixed;
  opacity: 0;
  pointer-events: none;

  padding: ${"1.25em"} ${"1.875em"} ${"1.25em"} ${"1.25em"};
  width: ${"31.25em"};
  max-width: min(90%, 90vw);
  height: auto;
  border-radius: ${"0.375em"};
  border: 1px solid rgba(0,0,0,0.2);
  top: 300px;
  background: white;
  box-shadow: 0 0 ${"0.625em"} rgba(0, 0, 0, 0.2);
  line-height: 1.5;
  box-sizing: border-box;

  &.visible {
    opacity: 1;
    pointer-events: all;
  }
`,S=d.Z.div`
  display: block;
  position: absolute;
  top: 0px;
  right: 0px;
  padding: ${5/16+"em"};
  width: ${"1.25em"};
  height: ${"1.25em"};
  text-align: center;
  cursor: pointer;
  box-sizing: content-box;
  color: #5a5a5a;
`;var C=(0,n.forwardRef)((function(e,t){const i=(0,n.useRef)(null),r=(0,n.useRef)({width:0,height:0});return(0,n.useEffect)((()=>{"function"===typeof t?t(i.current):t&&(t.current=i.current)}),[t]),(0,n.useEffect)((()=>{if(i.current){const t=i.current.getBoundingClientRect();r.current.width=t.width,r.current.height=t.height;const o=e.positionRect;if(o){let e=o.width/2+o.left-t.width/2;e<20&&(e=20);const n=window.innerWidth-t.width-20;e>n&&(e=n);let r=o.bottom+20;const s=window.innerHeight-t.height-20;r>s&&(r=s),i.current.style.left=Math.round(e)+"px",i.current.style.top=Math.round(r)+"px"}}}),[e.positionRect]),(0,o.jsx)(o.Fragment,{children:(0,o.jsxs)(Z,{ref:i,className:m()({visible:e.visible}),"data-wrp-action":"no-tapBlank no-translate no-lookup",children:[(0,o.jsx)(S,{className:"close-button",onClick:e.onClose,children:(0,o.jsx)(v.Z,{fontSize:"small",sx:{fontSize:"1.25em"}},void 0)},void 0),(0,o.jsx)("div",{"data-wrp-action":"lookup",children:e.data?.original},void 0),(0,o.jsx)("br",{},void 0),(0,o.jsx)("div",{children:e.data?.translated},void 0)]},void 0)},void 0)}));var R=(0,n.forwardRef)((function({visible:e,data:t,rect:i,onClose:r},s){const[a,d]=(0,n.useState)(!0);return(0,n.useEffect)((()=>{const t=()=>{const e=navigator.maxTouchPoints>0,t=Math.min(window.innerWidth,window.screen.width),i=e&&t<650;i&&!a&&d(!0),!i&&a&&d(!1)};return e&&window.addEventListener("resize",t),()=>{e&&window.addEventListener("resize",t)}}),[e,a]),(0,o.jsx)(o.Fragment,{children:a?(0,o.jsx)(E,{visible:e,data:t,onClose:r},void 0):(0,o.jsx)(C,{ref:s,visible:e,data:t,onClose:r,positionRect:i},void 0)},void 0)})),Y=i(2048);d.Z.div`
    position: fixed;
    bottom: ${"-10em"};
    display: flex;
    width: 80%;
    max-width: ${"18.75em"};
    left: 50%;
    transform: translateX(-50%);
    transition: all 0.3s cubic-bezier(0.42, 1.02, 0.7, 1.09);
    box-shadow: 0 0 ${"0.625em"} rgba(0, 0, 0, 0.2);
    pointer-events: all;
    overflow: hidden;
    z-index: 99;
    border-radius: ${"0.375em"};

    &.visible {
        bottom: ${"4.5em"};
    }
`,d.Z.div`
    user-select: none;
    height: 100%;
    width: 80%;
    line-height: ${"1.75em"};
    height: ${"2.5em"};
    padding: ${"0.375em"} ${"0.625em"};
    box-sizing: border-box;
    border-radius: ${"0.375em"} 0 0 ${"0.375em"};
    background-color: white;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-right-color: transparent;
    overflow-x: auto;

    &::-webkit-scrollbar {
      display: none;
    }
`,(0,d.Z)(Y.Z)`
    height: ${"2.5em"};
    width: ${"2.5em"};
    display: flex;
    flex-direction: column;
    font-size: inherit;
    font-weight: bold;
    border-radius: 0;
    background: #1b82fe;
    color: white;
    border-radius: 0 ${"0.375em"} ${"0.375em"} 0;
`;function N(){var e=(0,n.useState)([90,90]),t=e[0],i=e[1],r=(0,n.useState)(!1),s=r[0],a=r[1],d=(0,n.useState)(!1),l=d[0],c=d[1];return(0,o.jsxs)("div",{children:[(0,o.jsxs)("div",{onClick:function(e){i([e.clientX,e.clientY]),a(!0),c(!0)},style:{width:"100%",height:"100vh"},children:[(0,o.jsx)("h1",{children:"Experiment UI"}),(0,o.jsx)("p",{children:"xxx"})]}),(0,o.jsx)(y,{visible:s,position:t,status:"success",zoom:1,data:{word:"assistant",pronunciation:{audio_am:"https://res.iciba.com/resource/amp3/1/0/f5/49/f549cd73f694aa6f5541b4ae30894eea.mp3",audio_en:"https://res.iciba.com/resource/amp3/oxford/0/77/51/7751921c39abe3706be91900e30d858e.mp3",audio_other:"https://res-tts.iciba.com/f/5/4/f549cd73f694aa6f5541b4ae30894eea.mp3",symbol_am:"\u0259\u02c8s\u026ast\u0259nt",symbol_en:"\u0259\u02c8s\u026ast\u0259nt",symbol_other:""},answer:[["n.","\u52a9\u624b\uff0c\u52a9\u7406 [\u5316\u5b66]\uff08\u67d3\u8272\u7684\uff09\u52a9\u5242 \u8f85\u52a9\u7269 \u5e97\u5458\uff0c\u4f19\u8ba1"],["adj.","\u52a9\u7406\u7684 \u8f85\u52a9\u7684 \u6709\u5e2e\u52a9\u7684 \u526f\u7684"]]},onClose:function(){return a(!1)}}),(0,o.jsx)(k,{position:t,size:6}),(0,o.jsx)(R,{visible:l,data:{original:"Learn how to think in React with step-by-step explanations and interactive examples.",translated:"\u901a\u8fc7\u5206\u6b65\u89e3\u91ca\u548c\u4ea4\u4e92\u5f0f\u793a\u4f8b\uff0c\u4e86\u89e3\u5982\u4f55\u5728React\u4e2d\u8fdb\u884c\u601d\u8003\u3002"},onClose:function(){console.log("set tr visible false"),c(!1)}}),(0,o.jsx)(C,{visible:!0,positionRect:{left:20,bottom:300,width:200},data:{original:"Learn how to think in React with step-by-step explanations and interactive examples.",translated:"\u901a\u8fc7\u5206\u6b65\u89e3\u91ca\u548c\u4ea4\u4e92\u5f0f\u793a\u4f8b\uff0c\u4e86\u89e3\u5982\u4f55\u5728React\u4e2d\u8fdb\u884c\u601d\u8003\u3002"},onClose:function(){console.log("set tr visible false"),c(!1)}})]})}}},function(e){e.O(0,[50,774,888,179],(function(){return t=5172,e(e.s=t);var t}));var t=e.O();_N_E=t}]);