import React from "react";
import A from "../components/a";
import { get } from "lodash";

const config = {
  runScript: true,
  keepIntegrityAttribute: false,
};

const extractScope = {
  front: 1,
  behind: 1,
  /**
   * fn, bn为断句过程中的变量,
   * 当fn == front, bn == behind时, 断句即结束
   * 每次断句结束后, 需要重置fn, bn
   */
  fn: 0,
  bn: 0,
};


function isInline(target) {
  // console.log('isInline: ', target, typeof target, target.nodeName)
  if (!target) return false;
  if (target.nodeName === "#text") return true;

  let display = window.getComputedStyle(target).getPropertyValue("display");
  if (display.search("inline") !== -1) return true;

  return false;
}

/**
 * @param {String} text 
 */
function getBreakPoints(text) {
  let length = text.length;
  let breakPoints = [];
  let points = text.search(/[.?!。？！]/);
  while (points !== -1) {
    // console.log('=', points)
    breakPoints.push(length - text.length + points)
    text = text.slice(points + 1)
    points = text.search(/[.?!。？！]/);
  }

  // console.log('breakPoints', breakPoints)
  return breakPoints;
}

/**
 * 用于查找 #text 和 Element 混合节点的分句位置
 * 返回所有可能存在分句点的#text对象 和 分句点的相对位置
 * return [{target:#text, points:[]}]
 * @param {Node} target 
 */
function getTargetAndBreakPoint(target) {
  target = target.firstChild;
  let result = []
  while (target !== null) {
    console.log('--')
    if (target.nodeName !== '#text') {
      target = target.nextSibling;
      continue;
    }

    let text = target.textContent
    let length = text.length
    let point = text.search(/[.?!。？！]/)

    let p = {
      points: []
    }

    while (point !== -1) {
      p.points.push(length - text.length + point);
      text = text.slice(point + 1)
      point = text.search(/[.?!。？！]/)
    }

    if (p.points.length > 0) {
      p.target = target
      result.push(p)
    }

    target = target.nextSibling;
  }
  return result;
}

function comparePosition(target, breakPoints, x, y) {
  if (breakPoints.length <= 0) return 0;
  let middle = Math.round(breakPoints.length / 2) - 1;
  // console.log('comparePosition', target, breakPoints, x, y, middle)
  if (breakPoints[0] >= target.textContent.length) return false;

  window.getSelection().removeAllRanges()
  let range = new Range(target)
  range.setStart(target, breakPoints[middle]);
  range.setEnd(target, breakPoints[middle] + 1);
  window.getSelection().addRange(range);
  let domRect = range.getClientRects()[0]
  // console.log('domRect', domRect)
  // Previous
  if (y < domRect.y || (y < domRect.y + domRect.height && x < domRect.x)) {
    if (breakPoints.slice(0, middle) < 1) return breakPoints[0];
    return comparePosition(target, breakPoints.slice(0, middle), x, y)
  }

  // following
  if (y > domRect.y + domRect.height || (x > domRect.x && y > domRect.y)) {
    if (breakPoints.slice(middle + 1) < 1)
      return breakPoints.slice(middle, middle + 1)[0] + 1;
    return comparePosition(target, breakPoints.slice(middle + 1), x, y)
  }
}

export function calcOffset(target, x, y) {

  if (target.children.length === 0) {
    let breakPoints = getBreakPoints(target.textContent);
    target = target.firstChild;
    return [target, comparePosition(target, breakPoints, x, y)]
  }

  // #text 和 Element 混合节点
  let breakPoints = getTargetAndBreakPoint(target);
  if (breakPoints.length === 0) return [target.firstChild, 0];
  let p
  let obj
  for (obj of breakPoints) {
    p = comparePosition(obj.target, obj.points, x, y)
    if (p <= obj.points[obj.points.length - 1]) {
      return [obj.target, p];
    }
  }

  return [obj.target, p]
}

// 从html中提取部分文字区域， 例如：单词，句子
/**
 * @param {Node} target
 * @param {Number} offset
 * @param {Enumera} type
 */
export function extractPart(target, offset, type = "word") {
  if (!target) return ["", ""];
  // console.log('translate test',target);
  let frontPattern;
  let behindPattern;
  if (type === "word") {
    frontPattern = /^[\s\S]*\W(\w*?)$/;
    behindPattern = /^(\w*?)\W[\s\S]*$/;
  }

  if (type === "sentence") {
    frontPattern = /^[\s\S]*(?:(?:[.!?](?!\w))|[。！？\v\t])([\s\S]*?)$/;
    behindPattern = /^([\s\S]*?([.!?](?!\w))|[。！？\v\t])[\s\S]*$/;
  }

  let frontTarget = target;
  if (offset == null) {
    frontTarget = target.previousSibling;
    if (!isInline(target)) {
      frontTarget = null;
    }
  }
  // console.log("frontPattern", frontPattern, behindPattern);
  // console.log('a',frontTarget,offset)
  let front = frontFind(frontTarget, offset, true, frontPattern, type);
  // console.log('go -1 front',front,'go -2');
  let behind = behindFind(target, offset, true, behindPattern, type);
  // console.log('go -2 behind',behind,'go -end');

  extractScope.fn = 0;
  extractScope.bn = 0;

  return [front, behind];
}

// 寻找分割的断点位置
export function findSubPart(text, orientation, pattern, target, type) {

  let subPart;
  subPart = text.match(pattern);
  if (subPart === null) {
    return text;
  }

  if (orientation === 'front' && type === 'word') {
    extractScope.fn += 1;
    return subPart[1];
  }

  if (orientation === 'behind' && type === 'word') {
    extractScope.bn += 1;
    return subPart[1];
  }

  if (orientation === "front" && type === 'sentence') {
    let index = target.textContent.indexOf(text) + text.lastIndexOf('.')
    if (!sentenceEndingJudge(target, index)) {
      return text;
    }
    extractScope.fn += 1;
    subPart = subPart[1];
  }

  if (orientation === "behind" && type === 'sentence') {
    let index = target.textContent.indexOf(text) + text.indexOf('.');
    if (!sentenceEndingJudge(target, index)) {
      return text;
    }
    extractScope.bn += 1;
    subPart = subPart[1];
  }

  return subPart;
}

export function frontFind(
  target, offset,
  testParent = true,
  pattern,
  type
) {
  // 向前遍历节点 直到找到“起点”
  let result = {
    texts: [],
    elements: [],
    startTarget: null,
    startOffset: 0,
    break: false,
  };

  if (!target) return result;

  while (target) {
    // console.log("front, while", target,result.texts);
    if (target.nodeName == "#text") {
      let text;
      if (typeof offset === 'number') {
        text = target.textContent.slice(0, offset);
      } else {
        text = target.textContent;
      }

      // console.log('front text', text, target)
      let subPart = findSubPart(text, "front", pattern, target, type);
      // console.log('subPart', subPart)
      if (extractScope.front <= extractScope.fn) {
        result.texts.unshift(subPart);
        result.elements.unshift(subPart);
        result.startTarget = target;
        result.startOffset = text.lastIndexOf(subPart);
        // console.log('break')
        result.break = true;
        break;
      } else {
        subPart = text;
        result.texts.unshift(subPart);
        result.elements.unshift(subPart);
        result.startTarget = target;
        result.startOffset = 0;
      }
    } else if (isInline(target)) {
      // 需要遍历子节点
      let children = frontFind(target.lastChild, null, false, pattern, type);
      result.texts.unshift(...children.texts);
      result.elements.unshift(copy(target, children.elements));
      result.startTarget = children.startTarget;
      result.startOffset = children.startOffset;
      result.break = children.break;
      if (children.break) break;
    } else {
      result.startTarget = target;
      result.startOffset = target.textContent.length;
      break;
    }

    // 偶尔因target.parentName undefined 出错;
    if (target.previousSibling) {
      if (!isInline(target.previousSibling)) {
        extractScope.fn += 1;
      }
      target = target.previousSibling;
    } else if (testParent) {
      if (
        !isInline(target.parentNode) ||
        !isInline(target.parentNode.previousSibling)
      ) {
        extractScope.fn += 1;
      }
      target = target.parentNode.previousSibling;
    } else {
      break;
    }
    if (extractScope.front <= extractScope.fn) break;
    offset = null;
  }
  return result;
}

export function behindFind(
  target,
  offset,
  testParent = true,
  pattern,
  type
) {
  // 向后遍历节点  直到找到“终点” (词尾，句尾)
  let result = {
    texts: [],
    elements: [],
    endTarget: null,
    endOffset: 0,
    break: false,
  };
  if (!target) return result;
  if (!offset) offset = 0;
  while (target) {
    // console.log("next, while", target);
    if (target.nodeName == "#text") {
      let text = target.textContent.slice(offset);
      // console.log("behind text", text, target, offset, target.textContent);

      let subPart = findSubPart(text, "behind", pattern, target, type);
      if (extractScope.behind <= extractScope.bn) {
        result.texts.push(subPart);
        result.elements.push(subPart);
        result.endTarget = target;
        result.endOffset = offset + subPart.length;
        result.break = true;
        // console.log("break");
        break;
      } else {
        subPart = text;
        result.texts.push(subPart);
        result.elements.push(subPart);
        result.endTarget = target;
        result.endOffset = target.textContent.length;
      }
    } else if (isInline(target)) {
      // 需要遍历子节点
      let children = behindFind(target.firstChild, null, false, pattern);
      result.texts.push(...children.texts);
      result.elements.push(copy(target, children.elements));
      result.endTarget = children.endTarget;
      result.endOffset = children.endOffset;
      result.break = children.break;
      if (children.break) break;
    } else {
      result.endTarget = target;
      result.endOffset = 0;
      break;
    }

    if (target.nextSibling) {
      if (!isInline(target.nextSibling)) {
        extractScope.bn += 1;
      }
      target = target.nextSibling;
      // offset = 0;
    } else if (testParent) {
      if (
        !isInline(target.parentNode) ||
        !isInline(target.parentNode.nextSibling)
      ) {
        extractScope.bn += 1;
      }
      target = target.parentNode.nextSibling;
      // offset = 0;
    } else {
      break;
    }

    if (extractScope.behind <= extractScope.bn) break;
    offset = 0;
  }
  return result;
}
/**
 * 
 * @param {Object {target:#text, offset: 0}} start 
 * @param {Object {target:#text, offset: 2}} end 
 */
export function selectedText(start, end) {
  window.getSelection().removeAllRanges();
  let range = new Range();
  range.setStart(start.target, start.offset);
  range.setEnd(end.target, end.offset);
  window.getSelection().addRange(range);
}

// 🦉 英文人名缩写如何判断？
/**
 * 判断一段含“.”的文字，是否为一个句子的结尾。
 */
export function sentenceEndingJudge(target, index) {
  let text = target.textContent.slice(Math.max(0, index - 5), index + 5);
  if (index <= 1) {

  }
  if (index >= target.length - 1) {

  }
  const negateList = [
    /\d{1,4}\.\s?\d{1,4}/,
    /[\s^]Inc\.\s[a-z]/,
    /[\s^]([A-Z]\. ?){1,3}/,
  ];
  return !negateList.some(re => re.test(text))
}

export function deepCopy(node, returnChilren = false) {
  if (node.nodeName == "#text") return node.textContent;

  let children = node.firstChild;
  let childrenList = [];
  while (children) {
    childrenList = childrenList.concat(deepCopy(children));
    children = children.nextSibling;
  }

  if (returnChilren) {
    return childrenList;
  } else {
    let type = node.nodeName.toLowerCase();
    const ignoreTag = ["#comment"];

    if (ignoreTag.includes(type)) {
      return "";
    }

    let props = attToProps(node);
    const noChildren = ["img", "hr", "br", "input", "link", "wbr"];

    if (noChildren.includes(type)) {
      let element = React.createElement(type, props);
      return element;
    }

    let element = React.createElement(type, props, childrenList);
    return element;
  }
}

export function copy(content, children) {
  // Element、Children 为React Element
  let type = content.nodeName.toLowerCase();
  let props = attToProps(content);
  let element = React.createElement(type, props, ...children);
  return element;
}

export function extractHead(head) {
  /** 提取head中的有用部分，复制，返回列表 */
  let list = [];
  if (!head) return list;
  let base = false;
  for (let i = 0; i < head.childNodes.length; i++) {
    let node = head.childNodes[i];
    let type = node.nodeName;
    // console.log('nodeName', node, node.nodeName)
    // console.log('node src ->', node.href)

    if (type === "BASE") {
      base = true;
    }

    // 相对链接转换为绝对
    if (node.href) node.href = node.href;
    if (node.src) node.src = node.src;

    switch (type) {
      case "LINK":
        // 黑名单
        if (
          [/manifest/, /icon/].findIndex((value) => value.test(node.rel)) != -1
        )
          break;

        //白名单
        // if(![/stylesheet/,/preload/].findIndex((value)=>value.test(node.rel))) break;

        list.push(createElement(type, attToProps(node), node.innerText));
        break;
      case "STYLE":
        // list.push(this.createElement(type, this.attToProps(node), node.innerText));
        list.push(<style>{node.innerText}</style>);
        break;

      case "SCRIPT":
        // list.push(<script >{node.innerText}</script>);
        list.push(createElement("script", attToProps(node), node.innerText));
        break;

      case "TITLE":
      // 忽略
      case "#text":
      // case "SCRIPT":
      default:
        break;
    }
  }

  // if(!base)list.push(this.createBaseTag());
  return list;
}

//提取网页内容摘要
export function extractAbstract(node) {
  if (!node) return;
  let abstract = {};
  // icon
  let links = node.head.getElementsByTagName("link");
  for (let i = 0; i < links.length; i++) {
    let link = links[i];
    if (!link.rel) continue;
    if (link.rel.indexOf("icon") > 0) {
      abstract.icon = link.href;
      break;
    }
  }
  // title
  let title = "";
  let docTitle = node.head.getElementsByTagName("title");
  if (docTitle.length > 0) {
    title = docTitle[0].textContent;
  } else {
    let docH1 = node.body.getElementsByTagName("h1");
    if (docH1.length > 0) {
      title = docH1[0].textContent;
    } else {
    }
  }
  abstract.title = title;

  // description
  let pTags = node.getElementsByTagName("p");
  let description = "";
  for (let i = 0; i < pTags.length; i++) {
    description = description + pTags[i].textContent.trim().slice(0, 200);
    if (description.length >= 200) break;
  }

  let spanTags = node.getElementsByTagName("span");
  for (let i = 0; i < spanTags.length; i++) {
    description = description + spanTags[i].textContent.trim().slice(0, 200);
    if (description.length >= 200) break;
  }

  if (!description) description = node.body.textContent.trim().slice(0, 200);
  abstract.des = description;

  // console.log('摘要 描述',pTags, description);

  // abstract.url = this.props.app.url;
  // abstract.key = this.props.app.key;

  return abstract;
}

export function createElement(type, props, children) {
  type = type.toLowerCase();
  let element;

  switch (type) {
    case "div":
    case "span":
    case "p":
      element = React.createElement(type, props, children);
      return element;
    case "a":
      element = React.createElement(type, props, children);
      return element;
    // 以下为 empty elements (no children) 的标签
    case "input":
      // 存在value属性导致无法输入
      delete props.value;
    case "img":
    case "hr":
    case "br":
    case "link":
    case "wbr":
    case "area":
    case "base":
    case "embed":
    case "keygen":
    case "meta":
    case "param":
    case "source":
    case "track":
    case "menuitem":
      element = React.createElement(type, props);
      return element;
    // 以下为忽略的标签
    case "#comment":
    case "#document":
      break;
    case "script":
      // return '';
      if (!config.runScript) return "";
      // if (props.src) props["data-href"] = props.src;
      // delete props.src;
      props['data-wrp-content-script'] = true;
      element = React.createElement(type, props, children);
      return element;
    // 特殊处理
    case "svg":
      element = React.createElement(type, props, children);
      // element.dangerouslySetInnerHTML()
      return element;
    case "body":
      element = React.createElement("body", props, children);
      return element;
    case "col":
      return <col {...props}></col>;
    case "textarea":
      if (children.length > 1)
        console.warn(
          "React.reactElememt() Error! <textarea> tag only requests one children."
        );
      // element = React.createElement('div',props, children[0]);
      element = React.createElement("textarea", props, children[0]);
      return element;
    default:
      try {
        if (type.match(/^\w*$/)) {
          element = React.createElement(type, props, children);
          return element;
        }
      } catch (e) {
        console.log('React.createElement() Error on create "', type, '" tag!');
      }
  }
}

export function styleConvert(style) {
  // style = element.style;
  let styleObj = {};
  for (let i = 0; i < style.length; i++) {
    let styleKey = style[i].replace(/-([a-z])/g, (m, g) => g.toUpperCase());
    styleObj[styleKey] = style[style[i]];
  }
  // console.log("App.js: styleConvert() style:", style, "obj:", styleObj);
  return styleObj;
}

export function attToProps(node) {
  if (!node) return {};
  if (!node.attributes) return {};
  let props = {};
  for (let i = 0; i < node.attributes.length; i++) {
    let att = node.attributes[i];
    let attName = att.name;
    let attValue = att.value;

    // 转换
    switch (attName) {
      case "style":
        attValue = styleConvert(node.style);
        break;
      case "src":
      case "href":
        // 大多默认为相对路径，需补全链接
        attValue = node[attName];
        break;
      case "srcset":
        // Todo scrset 相对路径补全
        // 如何补全相对路径呢？这是一个问题，还有在css中的background-image:url()...
        attName = "srcSet";
        attValue = "";
        break;
      case "class":
        attName = "className";
        break;
      case "for":
        attName = "htmlFor";
        break;
      case "tabindex":
        attName = "tabIndex";
        break;
      case "itemprop":
        attName = "itemProp";
        break;
      case "itemscope":
        attName = "itemScope";
        break;
      case "itemtype":
        attName = "itemType";
        break;
      case "nomodule":
        attName = 'noModule'
        break;
      case "autocapitalize":
        attName = "autoCapitalize";
        break;
      case "acceptcharset":
        attName = "acceptCharset";
        break;
      case "autocomplete":
        attName = "autoComplete";
        break;
      case "crossorigin":
        attName = "crossOrigin";
        break;
      case "autocorrect":
        attName = "autoCorrect";
        break;
      case "onkeypress":
        attName = "onKeyPress";
        break;
      case "onclick":
        // React onClick 接受一个函数，html中的值只是文本，怎么办？
        attName = "onClick";
        try {
          attValue = new Function(attValue);
        } catch (e) { console.error(e) }
        break;
      case "spellcheck":
        attName = "spellCheck";
        break;
      case "playsinline":
        attName = "playsInline";
        break;
      case "colspan":
        attName = "colSpan";
        break;
      case "onload":
        // attName = "onLoad"
        try {
          // attValue = new Function(attValue);
        } catch (e) { console.error(e) }
        break;
      case "maxlength":
        attName = 'maxLength'
        break
      case "hreflang":
        attName = 'hrefLang'
        break;
      case "xml:space":
      case "fill-rule":
      case "clip-rule":
      case "stroke-linecap":
      case "stroke-miterlimit":
      case "stroke-width":
      case "stroke-linejoin":
      case "xmlns:xlink":
      case "enable-background":
      case "accept-charset":
        attName = attName.replace(/\W([a-z])/g, (m, g) => g.toUpperCase());
        break;
    }
    // attName = attName.replace(/\W([a-z])/g,(m,g)=>g.toUpperCase());
    props[attName] = attValue;
    if (!config.keepIntegrityAttribute) delete props.integrity;

  }
  return props;
}

export function frontHaveWordEnd(node) {
  /**判断前半部分(node)的末尾是否是单词的末尾， 即判断前半部分(node)的末尾是否有单词分割符（空格等） */
  let children = node;
  let deep = 0;
  while (children) {
    let child = children; // 备份
    if (!this.isInline(children)) return false;
    if (children.nodeName == "#text") {
      let text = children.textContent;
      if (/[a-zA-Z0-9_-]/.test(text[text.length - 1])) return true;
      return false;
    }

    if (!children.lastChild) {
      children = children.previousSibling;
      // deep = deep
    } else {
      children = children.lastChild;
      deep = deep + 1;
    }

    // 继续向上就不必了吧, 算了， 先写上
    if (!children && deep > 0) {
      children = child.parentNode.previousSibling;
      deep = deep - 1;
    }
  }
}

export function behindHaveWordEnd(node) {
  /**判断后半部分（node）的开端是否是单词的开端， 即判断后半部分(node)的开端是否有单词分割符（空格等） */
  let children = node;
  let deep = 0;
  while (children) {
    let child = children;
    if (!isInline(children)) return false;
    if (children.nodeName == "#text") {
      let text = children.textContent;
      if (/[a-zA-Z0-9_-]/.test(text[0])) return true;
      return false;
    }

    if (!children.firstChild) {
      children = children.nextSibling;
      // deep = deep
    } else {
      children = children.firstChild;
      deep = deep + 1;
    }

    // 继续向上就不必了吧, 算了， 先写上
    if (!children && deep > 0) {
      children = child.parentNode.nextSibling;
      deep = deep - 1;
    }
  }
}

export function htmlTraversal(node) {
  if (!node) return [];
  // console.log('htmlTraversal',node,node.nodeName)
  // let ignoreTag = ["script",'meta','link','#comment','#document','iframe'];
  // let mostCommon = ["DIV","P","SPAN"]
  let type, props, element;
  switch (node.nodeName) {
    case "#text":
      return node.textContent;
    case "#comment":
    case "#document":
    case "IFRAME":
      // 忽略
      return [];
    case "STYLE":
      // console.log('style tag->',node, node.innerText, node.scoped);
      type = node.nodeName.toLowerCase();

      props = attToProps(node);
      element = createElement(type, props, node.innerText);
      return element;
    case "SCRIPT":
      type = node.nodeName.toLowerCase();

      props = attToProps(node);
      element = createElement(type, props, node.innerText);
      return element;
    case "DIV":
    case "P":
    case "SPAN":
    case "A":
    default:
      let childrenList = [];
      for (let i = 0; i < node.childNodes.length; i++) {
        let children = node.childNodes[i];
        childrenList = childrenList.concat(htmlTraversal(children));
      }

      type = node.nodeName.toLowerCase();

      props = attToProps(node);
      element = createElement(type, props, childrenList);
      return element;
  }
}

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

/**
 * 
 * @param {Array} path
 * @param {String} action
 */
export function targetActionFilter(path, action, deep = 5) {
  if (!Array.isArray(path)) {
    console.warn('targetActionFilter(path:Node[])')
    return true;
  }
  path = path.slice(0, -3);
  for (let i = path.length - 1, j = Math.max(path.length - deep, 0); i >= j; i--) {
    let blockAttr = path[i].attributes['data-wrp-action-block'];
    if (!blockAttr) continue;
    if (blockAttr.value.split(' ').includes(action)) {
      console.log('filter action:', action);
      return false;
    }
  }
  return true;
}

/**
 * 
 * @param {event} e event
 * @param {function} callback function(<a/>)
 */
export function linkIntercept(e, callback) {
  let path = e.path || getPath(e.target);
  for (let i = 0; i < path.length; i++) {
    if (path[i].nodeName !== 'A') continue;
    if (!targetActionFilter(path.slice(i), 'intercept')) continue;
    e.preventDefault();
    e.stopPropagation();
    if (callback) callback(path[i]);
  }
}

export function calcHash(text) {
  return Math.abs(text.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0));
}

export function getPath(target) {
  let path = [];
  while (target !== null) {
    path.unshift(target);
    target = target.parentNode;
  }
  return path;
}

export function scrollToTop() {
  document.querySelector('html').scrollTop = 0;
}

export function cleanDOM() {

}
