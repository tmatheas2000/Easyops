import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
    selector: 'app-delete-confirmation',
    templateUrl: './delete-confirmation.component.html',
    styleUrls: ['./delete-confirmation.component.scss'],
    standalone: false
})
export class DeleteConfirmationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  performAction(result: boolean): void {
    this.dialogRef.close(result);
  }

}
