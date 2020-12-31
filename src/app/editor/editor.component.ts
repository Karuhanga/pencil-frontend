import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import * as MediumEditor from 'medium-editor';

import "node_modules/medium-editor/dist/js/medium-editor.min.js";
import {PersistenceService} from "../persistence.service";


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements OnDestroy, AfterViewInit {
  @ViewChild('editor', { static: true }) editorRef?: ElementRef;

  mediumEditor?: MediumEditor.MediumEditor;
  content?: string;
  contentLoading = true;
  lastUpdated?: Date;

  constructor(private persistenceService: PersistenceService) { }

  ngAfterViewInit(): void {
    this.mediumEditor = new MediumEditor(this.editorRef?.nativeElement, {
      placeholder: {
        hideOnClick: false,
        text: "Your thoughts here...",
      },
    });
    this.mediumEditor.subscribe('editableInput', () => this.updateContent());
    this.initContent();
  }

  initContent() {
    this.persistenceService.getNote().then(snapshot => {
      this.content = snapshot.data()?.toString();
      this.mediumEditor?.setContent(this.content || "df");
      this.contentLoading = false;
    });
  }

  updateContent() {
    this.content = this.mediumEditor?.getContent();
    this.persistenceService.writeNote(this.content || "").then(() => {
      this.lastUpdated = new Date();
    });
  }

  ngOnDestroy(): void {
    this.mediumEditor?.destroy();
    this.mediumEditor = undefined;
  }
}
