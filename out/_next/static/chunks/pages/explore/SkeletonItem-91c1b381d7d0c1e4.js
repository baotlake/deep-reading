(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[761],{9906:function(t,e,n){"use strict";n.d(e,{Z:function(){return N}});var i=n(1461),a=n(7896),r=n(2784),o=n(6277),s=n(8165),h=n(7597);function l(t){return String(t).match(/[\d.\-+]*\s*(.*)/)[1]||""}function u(t){return parseFloat(t)}var d=n(7591),c=n(916),m=n(9723),p=n(2606);function f(t){return(0,p.Z)("MuiSkeleton",t)}(0,n(8922).Z)("MuiSkeleton",["root","text","rectangular","circular","pulse","wave","withChildren","fitContent","heightAuto"]);var g=n(2322);const w=["animation","className","component","height","style","variant","width"];let v,_,b,k,x=t=>t;const C=(0,s.F4)(v||(v=x`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`)),Z=(0,s.F4)(_||(_=x`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`)),y=(0,c.ZP)("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(t,e)=>{const{ownerState:n}=t;return[e.root,e[n.variant],!1!==n.animation&&e[n.animation],n.hasChildren&&e.withChildren,n.hasChildren&&!n.width&&e.fitContent,n.hasChildren&&!n.height&&e.heightAuto]}})((({theme:t,ownerState:e})=>{const n=l(t.shape.borderRadius)||"px",i=u(t.shape.borderRadius);return(0,a.Z)({display:"block",backgroundColor:(0,d.Fq)(t.palette.text.primary,"light"===t.palette.mode?.11:.13),height:"1.2em"},"text"===e.variant&&{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${i}${n}/${Math.round(i/.6*10)/10}${n}`,"&:empty:before":{content:'"\\00a0"'}},"circular"===e.variant&&{borderRadius:"50%"},e.hasChildren&&{"& > *":{visibility:"hidden"}},e.hasChildren&&!e.width&&{maxWidth:"fit-content"},e.hasChildren&&!e.height&&{height:"auto"})}),(({ownerState:t})=>"pulse"===t.animation&&(0,s.iv)(b||(b=x`
      animation: ${0} 1.5s ease-in-out 0.5s infinite;
    `),C)),(({ownerState:t,theme:e})=>"wave"===t.animation&&(0,s.iv)(k||(k=x`
      position: relative;
      overflow: hidden;

      /* Fix bug in Safari https://bugs.webkit.org/show_bug.cgi?id=68196 */
      -webkit-mask-image: -webkit-radial-gradient(white, black);

      &::after {
        animation: ${0} 1.6s linear 0.5s infinite;
        background: linear-gradient(90deg, transparent, ${0}, transparent);
        content: '';
        position: absolute;
        transform: translateX(-100%); /* Avoid flash during server-side hydration */
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
      }
    `),Z,e.palette.action.hover)));var N=r.forwardRef((function(t,e){const n=(0,m.Z)({props:t,name:"MuiSkeleton"}),{animation:r="pulse",className:s,component:l="span",height:u,style:d,variant:c="text",width:p}=n,v=(0,i.Z)(n,w),_=(0,a.Z)({},n,{animation:r,component:l,variant:c,hasChildren:Boolean(v.children)}),b=(t=>{const{classes:e,variant:n,animation:i,hasChildren:a,width:r,height:o}=t,s={root:["root",n,i,a&&"withChildren",a&&!r&&"fitContent",a&&!o&&"heightAuto"]};return(0,h.Z)(s,f,e)})(_);return(0,g.jsx)(y,(0,a.Z)({as:l,ref:e,className:(0,o.Z)(b.root,s),ownerState:_},v,{style:(0,a.Z)({width:p,height:u},d)}))}))},9279:function(t,e,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/explore/SkeletonItem",function(){return n(3269)}])},3269:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return s}});var i=n(2322),a=n(9906),r=n(1894),o=n.n(r);function s(){return(0,i.jsxs)("div",{className:o().wrapper,children:[(0,i.jsx)("div",{className:o().image,children:(0,i.jsx)(a.Z,{variant:"circular",width:48,height:48})}),(0,i.jsxs)("div",{className:o().text,children:[(0,i.jsx)(a.Z,{variant:"text",height:20}),(0,i.jsx)(a.Z,{height:40})]})]})}},1894:function(t){t.exports={wrapper:"skeletonItem_wrapper___iZvv",image:"skeletonItem_image___0Lpw",text:"skeletonItem_text___10VN"}}},function(t){t.O(0,[774,888,179],(function(){return e=9279,t(t.s=e);var e}));var e=t.O();_N_E=e}]);