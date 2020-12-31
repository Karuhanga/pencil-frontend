import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import * as MediumEditor from 'medium-editor';
import * as moment from 'moment';

import "node_modules/medium-editor/dist/js/medium-editor.min.js";
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
  content?: string;
  contentLoading = true;
  lastUpdated?: moment.Moment;

  constructor(private persistenceService: PersistenceService) {
  }

  ngAfterViewInit(): void {
    this.initContent();
  }

  ngOnDestroy(): void {
    this.mediumEditor?.destroy();
    this.mediumEditor = undefined;
  }

  private initContent() {
    this.persistenceService.getNote().then(snapshot => {
      this.content = snapshot.data()?.content;
      this.lastUpdated = moment();
    }).finally(() => this.setupEditor());
  }

  private setupEditor() {
    this.mediumEditor = new MediumEditor(this.editorRef?.nativeElement, {
      placeholder: {
        hideOnClick: false,
        text: "Your thoughts here...",
      },
    });
    this.mediumEditor?.setContent(this.content || "");
    this.mediumEditor.subscribe('editableInput', () => this.updateContent());
    this.contentLoading = false;
  }

  private updateContent() {
    this.content = this.mediumEditor?.getContent();
    if (this.shouldSave()) {
      this.persistenceService.writeNote(this.content || "").then(() => {
        this.lastUpdated = moment();
      });
    }
  }

  private shouldSave() {
    return !this.lastUpdated || (moment().diff(this.lastUpdated) / 1000) > PERSIST_LAG_SECONDS;
  }
}
