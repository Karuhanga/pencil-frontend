import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import * as MediumEditor from 'medium-editor';
import "node_modules/medium-editor/dist/js/medium-editor.min.js";
import * as moment from 'moment';

// @ts-ignore
import debounce from "lodash.debounce";

import {PersistenceService} from "../persistence.service";


const PERSIST_LAG_SECONDS = 15;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements OnDestroy, AfterViewInit {
  @ViewChild('editor', {static: true}) editorRef?: ElementRef;

  mediumEditor?: MediumEditor.MediumEditor;
  contentLoading = true;
  lastUpdated?: moment.Moment;

  constructor(private persistenceService: PersistenceService) {}

  ngAfterViewInit(): void {
    this.initContent();
  }

  ngOnDestroy(): void {
    this.mediumEditor?.destroy();
    this.mediumEditor = undefined;
  }

  private initContent() {
    let content: string | undefined;

    this.persistenceService.getNote().then(snapshot => {
      content = snapshot.data()?.content;
      this.lastUpdated = moment();
    }).finally(() => this.setupEditor(content));
  }

  private setupEditor(content?: string) {
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
    this.mediumEditor.setContent(content || "");
    this.setupSubscribers();
    this.contentLoading = false;
  }

  private setupSubscribers() {
    const debouncedPersist = debounce((content: string) => this.persist(content), PERSIST_LAG_SECONDS*1000, {leading: true});

    this.mediumEditor?.subscribe('editableInput', () => {
      const content = this.mediumEditor?.getContent();
      const parsedContent = EditorComponent.parseLatex(content) || "";

      debouncedPersist(parsedContent);
      if (content !== parsedContent) this.mediumEditor?.setContent(parsedContent);
    });
  }

  private persist(content: string) {
    return this.persistenceService.writeNote(content).then(() => {
      this.lastUpdated = moment();
    }).catch(console.error);
  }

  private static parseLatex(html?: string) {
    // not very performant, but as mentioned earlier, I needed more time to figure out why the extension's change
    // listeners weren't being triggered. If those worked, we an restrict this parsing to a single, tiny node :)
    return html?.replace(/\$(.*?)\$/g, (formula, withoutDollars) => {
      return `<span>&#8203;</span><latex-js baseURL="https://cdn.jsdelivr.net/npm/latex.js/dist/">\\[ ${withoutDollars} \\]</latex-js><span>&#8203;</span>`
    })
  }
}
