import { Injectable, NgZone } from '@angular/core';
import { Firestore, collection, getDocs, addDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { TableData } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private firestore: Firestore, private ngZone: NgZone) {}

  async getRecords(): Promise<TableData[]> {
    const list: TableData[] = [];
    try {
      const infoCollection = collection(this.firestore, 'Info');
      const querySnapshot = await getDocs(infoCollection);

      this.ngZone.run(() => {
        querySnapshot.forEach((docSnap) => {
          const temp: TableData = { ...docSnap.data() } as TableData;
          temp.id = docSnap.id;
          list.push(temp);
        });
      });

    } catch (error) {
      console.error('Error fetching records:', error);
    }

    return list;
  }

  async addRecord(data: any): Promise<string> {
    try {
      const infoCollection = collection(this.firestore, 'Info');
      const docRef = await addDoc(infoCollection, data);
      console.log('Added Successfully!');
      return docRef.id;
    } catch (error) {
      console.error('Something went wrong!', error);
      return '';
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, `Info/${id}`);
      await deleteDoc(docRef);
      console.log('Deleted Successfully!');
    } catch (error) {
      console.error('Something went wrong!', error);
    }
  }
}