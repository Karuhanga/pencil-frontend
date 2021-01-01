import {Component, Input} from '@angular/core';
// @ts-ignore
import { parse, HtmlGenerator } from 'latex.js'

@Component({
  selector: 'app-latex-viewer',
  templateUrl: './latex-viewer.component.html',
  styleUrls: ['./latex-viewer.component.css']
})
export class LatexViewerComponent {
  @Input() html?: string;

  constructor() { }

  content() {
    console.log(this.parseLatex(this.html))
    return this.parseLatex(this.html);
  }

  private parseLatex(html?: string) {
    return html?.replace(/\$(.*?)\$/g, formula => {
      return LatexViewerComponent.getFragmentHtml(parse(formula, { generator: new HtmlGenerator({ hyphenate: false }) }).domFragment());
    })
  }

  private static getFragmentHtml(fragment: DocumentFragment) {
    const div = document.createElement('div');
    div.appendChild( fragment.cloneNode(true) );
    return div.innerHTML;
  }

}
