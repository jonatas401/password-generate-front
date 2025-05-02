import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Checkbox } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ListComponent } from '../app/components/list/list.component';
import { GeneratorService } from './sevice/generator.service';
import { PaginatorState } from 'primeng/paginator';
import { HttpParams } from '@angular/common/http';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormBuilder, FormControl, FormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from "primeng/floatlabel"
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TableModule, CommonModule, ListComponent,Checkbox,InputGroupAddonModule, FormsModule,ButtonModule,
    InputNumber,FloatLabelModule,ReactiveFormsModule,ToastModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[GeneratorService,MessageService]
})
export class AppComponent {
  generatorService = inject(GeneratorService);
  messageService = inject(MessageService);
  router = inject(Router);
  loading =true
  page = 0
  size=8
  first = 0
  items:any = []
  totalRecords: number = 0;
  creating = false
  deleting = false

  generatePasswordForm = {
    numbers: false,
    isUpper: false,
    isLower: false,
    specialCharacter: false,
    size : 8
  }


  fb = inject(FormBuilder)
  form = this.fb.group({
    numbers:[false],
    sizePassword:["",[Validators.required, Validators.min(8)]],
    isUpper:false,
    specialCharacter:false,
    isLower:false
  });

  constructor() { }

  handlePageEvent(event: PaginatorState){
    this.page = event.page ?? 0;
    this.size = event.rows ?? 5;
    this.getAll();
  }

  getAll(filters?: any){
    let params = new HttpParams();
    params = params.set("page",this.page)
    params = params.set("size",this.size)
    this.loading = true
    if(filters){
      filters.get('createdDate') != undefined? params = params.set("createdDate",filters.get('createdDate')):null
    }
    this.generatorService.getAll(params).subscribe({
      next: (res: any) => {
        this.items = res.content;
        this.first = res.page.totalPages
        this.totalRecords = res.page.totalElements
        this.loading = false

      },
      error: (error: any) => {
        this.loading = false
       // this.openSnackBar("Erro ao tentar listar, por favor tente novamente","fechar")
      }

    });
  }

  search(filters: any){
    this.page = 0
    this.getAll(filters);
  }

  generatePassword(){
    this.creating = true
    this.generatorService.create(this.generatePasswordForm).subscribe({
      next: (res: any) => {
        this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Senha gerada com sucesso!',life: 3000, });
        this.creating = false
        this.getAll();
      },
      error: (err: any) => {
        this.creating = false
        if(err.error.errors && err.error.errors[0].field == "size"){
          this.messageService.add({ severity: 'error', summary: 'Negado', detail: 'Não é possível gerar senhas com menos de 8 caracters !',life: 3000, });
        }else{
          this.messageService.add({ severity: 'error', summary: 'Negado', detail: 'Erro ao tentar gerar senha !',life: 3000, });
        }
      }

    });

  }

  deletePassword(id: any){
    this.deleting = true
    this.generatorService.delete(id).subscribe({
      next: (res: any) => {
        this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Senha deletada com sucesso!',life: 3000, });
        this.deleting = false
        this.getAll();
      },
      error: (err: any) => {
        this.deleting = false
        this.messageService.add({ severity: 'error', summary: 'Negado', detail: 'Erro ao tentar deletar senha !',life: 3000, });

      }

    });

  }

}
