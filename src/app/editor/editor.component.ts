import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import * as MediumEditor from 'medium-editor';
import "node_modules/medium-editor/dist/js/medium-editor.min.js";
import * as moment from 'moment';

import {PersistenceService} from "../persistence.service";
import {parseLatex} from "./extensions";


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
    this.mediumEditor?.subscribe('editableInput', () => {
      const currentContent = this.mediumEditor?.getContent();
      const newContent = parseLatex(currentContent) || "";

      if (currentContent === newContent) return;

      this.mediumEditor?.setContent(newContent);
      if (this.shouldSave()) {
        this.persistenceService.writeNote(newContent).then(() => {
          this.lastUpdated = moment();
        }).catch(console.error);
      }
    });
  }

  private shouldSave() {
    return !this.lastUpdated || (moment().diff(this.lastUpdated) / 1000) > PERSIST_LAG_SECONDS;
  }
}
