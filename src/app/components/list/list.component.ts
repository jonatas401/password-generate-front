import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { Dialog } from 'primeng/dialog';
import { DatePicker } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-list',
  imports: [TableModule, CommonModule, PaginatorModule,ButtonModule, InputTextModule,
    InputIconModule,DatePicker,FormsModule,Dialog],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  date: Date | undefined;
  filters: any = new Map();
  arr:any[] = []
  idDelete: String = "";
  visible = false
  @Input() isDelete = false;
  @Input() loading: boolean = true;
  @Input() totalRecords = 19
  @Input() first: number = 0;
  @Input() rows: number = 8;
  @Input() items: any[] = [];
  @Output() open = new EventEmitter<void>();
  @Output() searching = new EventEmitter<String>();
  @Output() pageEventEmiter = new EventEmitter();
  @Output() deleteItem = new EventEmitter<string>();


  ngOnInit(): void {
    this.list()
  }

  list(){
    this.open.emit();
  }

  handlePageEvent(event: PaginatorState) {
    this.pageEventEmiter.emit(event)
  }

  search(value: any, key: any){
    if(key == "createdDate"){
      value = value.toISOString().split('T')[0];
    }
    this.filters.set(key,value)
    this.searching.emit(this.filters);
  }

  refresh(){
    this.date = undefined
    this.list()
  }

  delete(value: any) {
    this.idDelete = value
    this.visible = false
    this.deleteItem.emit(value);
  }
}
