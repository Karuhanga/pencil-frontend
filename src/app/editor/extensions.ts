import * as MediumEditor from 'medium-editor';
// @ts-ignore
import { parse, HtmlGenerator } from 'latex.js'



export function buildLatexExtension() {
  // @ts-ignore
  const MyExtension = MediumEditor.Extension.extend({
    name: 'latexExtension',
    checkState: function (node: HTMLElement) {
      console.log(node);
      if (node.hasChildNodes() || !node.innerText.match(/^\$.*\$$/g)) return;
      let doc = parse(node.innerText, { generator: new HtmlGenerator({ hyphenate: false }) }).htmlDocument();
      node.innerText = parse(node.innerText, { generator: new HtmlGenerator({ hyphenate: false }) }).htmlDocument().documentElement.outerHTML;
    },
    init: function () { console.log(34) },
  });

  return new MyExtension();
}
