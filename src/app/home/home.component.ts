import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { TableData } from '../models/models';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['sno', 'name', 'contact', 'delete'];
  data : Array<TableData> = [];
  searchText: string = '';
  dataSource = new MatTableDataSource<TableData>(this.data);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  personForm = new FormGroup({
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    contactNo: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(13)]),
  });

  constructor(public dialog: MatDialog, private snackBar: MatSnackBar, private homeService: HomeService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.homeService.getRecords().then(res=>{
      this.dataSource = new MatTableDataSource<TableData>(res);
      this.dataSource.sortingDataAccessor = (item, property) => {
        console.log(item, property);
        switch(property) {
          case 'name': return String(item.firstName) + String(item.lastName);
          case 'contact': return String(item.contactNo);
          default: return String(item.firstName);
        }
      };
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteData(id: string){
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '250px',
      data: {title: 'Are you sure you want to delete ?', positive: 'Delete', negative: 'Cancel' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.homeService.deleteRecord(id).then(data=>{
          this.dataSource.data = this.dataSource.data.filter((res)=>{
            return res.id != id ? true : false;
          });
          this.displayMessage('Record deleted Successfully !');
        });
      }
    });
  }

  addDate(){
    let DataList: TableData[] = this.dataSource.data;
    let newData: TableData = this.personForm.value;
    let found: boolean = false;

    DataList.forEach(res=> {
      if(res.contactNo == newData.contactNo || (String(res.firstName) + String(res.lastName)).toLocaleLowerCase() == (String(newData.firstName) + String(newData.lastName)).toLocaleLowerCase())
      {
        found = true;
      }
    });

    if(found)
    {
      this.displayMessage('Record already found !');
    }
    else{
      this.homeService.addRecord(newData).then(res=>{
        this.displayMessage('Record added Successfully !');
        newData.id = res;
        DataList.push(newData);
        this.dataSource.data = DataList;
        this.personForm.reset();
      });
    }
  }

  displayMessage(message: any){
    this.snackBar.open(message, '',
    {
      panelClass: ['success-message'],
      verticalPosition: 'top',
      duration: 2000
    });
  }

  applyFilter() {
    let searchTxt = this.searchText.trim();
    searchTxt = searchTxt.toLowerCase();
    this.dataSource.filter = searchTxt;
  }

}
