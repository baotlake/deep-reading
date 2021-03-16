

export function replaceScript(attr = 'data-wrp-content-script', value = true) {
  let scriptList = document.querySelectorAll(`[${attr}=${value}]`);
  scriptList.forEach(
    s => {
      let newScript = document.createElement('script');
      for (let a of s.attributes) {
        newScript[a.name] = a.value
      }
      // s.parentNode.replaceChild(newScript, s);
      s.parentNode.appendChild(newScript)
    }
  )
}


export function calcHash(text) {
  return Math.abs(text.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0));
}