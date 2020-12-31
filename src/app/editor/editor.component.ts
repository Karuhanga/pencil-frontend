import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import * as MediumEditor from 'medium-editor';
import "node_modules/medium-editor/dist/js/medium-editor.min.js";
import * as moment from 'moment';

import {PersistenceService} from "../persistence.service";
import {parseLatex} from "./extensions";
import {BehaviorSubject} from "rxjs";


const PERSIST_LAG_SECONDS = 15;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements OnDestroy, AfterViewInit {
  @ViewChild('editor', {static: true}) editorRef?: ElementRef;

  mediumEditor?: MediumEditor.MediumEditor;
  readonly content = new BehaviorSubject<string|undefined>(undefined);
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
    this.persistenceService.getNote().then(snapshot => {
      this.content.next(snapshot.data()?.content);
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
    this.setupSubscribers();
    this.contentLoading = false;
  }

  private setupSubscribers() {
    this.content.subscribe(content => this.mediumEditor?.setContent(content || ""));
    this.content.subscribe(content => {
      if (this.shouldSave()) {
        this.persistenceService.writeNote(content || "").then(() => {
          this.lastUpdated = moment();
        }).catch(console.error);
      }
    });

    this.mediumEditor?.subscribe('editableInput', () => {
      const newContent = parseLatex(this.mediumEditor?.getContent());
      if (this.content.getValue() !== newContent){
        this.content.next(newContent);
      }
    });
  }

  private shouldSave() {
    return !this.lastUpdated || (moment().diff(this.lastUpdated) / 1000) > PERSIST_LAG_SECONDS;
  }
}
