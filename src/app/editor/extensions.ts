import * as MediumEditor from 'medium-editor';
// @ts-ignore
import { parse, HtmlGenerator } from 'latex.js'



export function buildLatexExtension() {
  // @ts-ignore
  const MyExtension = MediumEditor.Extension.extend({
    name: 'latexExtension',
    checkState: function (node: HTMLElement) {
      if (node.hasChildNodes() || !node.innerText.match(/^\$.*\$$/g)) return;
      node.innerText = parseLatex(node.innerText) || "";
    },
    init: function () { console.log(34) },
  });

  return new MyExtension();
}

export function parseLatex(html?: string) {
  return html?.replace(/\$(.*?)\$/g, formula => {
    return getFragmentHtml(parse(formula, { generator: new HtmlGenerator({ hyphenate: false }) }).domFragment());
  })
}


export function getFragmentHtml(fragment: DocumentFragment) {
  const div = document.createElement('div');
  div.appendChild( fragment.cloneNode(true) );
  return div.innerHTML;
}
