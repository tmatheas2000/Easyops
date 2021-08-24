import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { environment } from 'src/environments/environment';
import { TableData } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(public ngZone: NgZone) {
    firebase.initializeApp(environment.firebaseConfig);
   }

  async getRecords(): Promise<TableData[]>{
    let list : Array<TableData> = [];
    await firebase.firestore().collection('Info')
    .get()
    .then((querySnapshot) => {
      this.ngZone.run(() => {
        querySnapshot.forEach((doc) => {
          let temp: TableData = doc.data();
          temp.id = doc.id;
          list.push(temp);
        });
      });
    }).catch((err) => {
      console.log(err);
      list = [];
    });
    return list;
  }

  async addRecord(data: any): Promise<string> {
    let id: string = ''
    await firebase.firestore().collection('Info').add(data)
    .then((docRef) => {
      id = docRef.id;
      console.log('Added Successfully !');
    })
    .catch((error) => {
      console.error('Something went wrong !', error);
    });
    return id;
  }

  async deleteRecord(id: any): Promise<void>{
    await firebase.firestore().collection('Info').doc(id).delete()
    .then(res => {
      console.log('Deleted Successfully !');
    })
    .catch((error) => {
      console.error('Something went wrong !', error);
    });
  }
}