import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import * as MediumEditor from 'medium-editor';
import "node_modules/medium-editor/dist/js/medium-editor.min.js";
import * as moment from 'moment';
// @ts-ignore
import { parse, HtmlGenerator } from 'latex.js'

import {PersistenceService} from "../persistence.service";
import {buildLatexExtension} from "./extensions";


const PERSIST_LAG_SECONDS = 15;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements OnDestroy, AfterViewInit {
  @ViewChild('editor', {static: true}) editorRef?: ElementRef;

  mediumEditor?: MediumEditor.MediumEditor;
  private content?: string;
  contentLoading = true;
  lastUpdated?: moment.Moment;

  constructor(private persistenceService: PersistenceService) {
  }

  ngAfterViewInit(): void {
    this.hydrateContent();
  }

  ngOnDestroy(): void {
    this.mediumEditor?.destroy();
    this.mediumEditor = undefined;
  }

  private hydrateContent() {
    this.persistenceService.getNote().then(snapshot => {
      this.setEditorContent(snapshot.data()?.content);
      this.lastUpdated = moment();
    }).finally(() => this.setupEditor());
  }

  private setupEditor() {
    this.mediumEditor = new MediumEditor(this.editorRef?.nativeElement, {
      placeholder: {
        hideOnClick: false,
        text: "Your thoughts here...",
      },
      extensions: {
        // finally abandoned this bc the event is not being triggered for some reason
        // latexExtension: buildLatexExtension(),
      }
    });
    this.mediumEditor?.setContent(this.getEditorContent());
    this.mediumEditor.subscribe('editableInput', () => this.updateContent());
    this.contentLoading = false;
  }

  private updateContent() {
    this.setEditorContent(this.parseLatex(this.mediumEditor?.getContent()));
    this.mediumEditor?.setContent(this.getEditorContent());
    if (this.shouldSave()) {
      this.persistenceService.writeNote(this.getEditorContent()).then(() => {
        this.lastUpdated = moment();
      }).catch(console.error);
    }
  }

  private parseLatex(html?: string) {
    return html?.replace(/\$(.*?)\$/g, formula => {
      return getFragmentHtml(parse(formula, { generator: new HtmlGenerator({ hyphenate: false }) }).domFragment());
    })
  }

  private shouldSave() {
    return !this.lastUpdated || (moment().diff(this.lastUpdated) / 1000) > PERSIST_LAG_SECONDS;
  }

  getEditorContent() {
    return this.content || "";
  }

  setEditorContent(content?: string) {
    this.content = content;
  }
}


function getFragmentHtml(fragment: DocumentFragment) {
  const div = document.createElement('div');
  div.appendChild( fragment.cloneNode(true) );
  return div.innerHTML;
}
