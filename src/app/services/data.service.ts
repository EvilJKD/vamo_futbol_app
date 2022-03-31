import { Injectable } from '@angular/core';
import {
	collection,
	doc,
	docData,
	DocumentReference,
	CollectionReference,
	Firestore,
	onSnapshot,
	query,
	where,
	Unsubscribe,
	Query,
	DocumentData,
	collectionData,
	collectionChanges,
	docSnapshots,
	GeoPoint,
	FieldPath
} from '@angular/fire/firestore';
import { addDoc, setDoc } from '@firebase/firestore';
import { identity, Observable } from 'rxjs';
import { Field, Match } from '../interfaces/interfaces';


@Injectable({
	providedIn: 'root'
})
export class DataService {

	constructor(private firestore: Firestore) { }


	//MATCHES
	//Get all matches
	getMatches(): Observable<Match[]> {
		const matchesRef = collection(this.firestore, 'matches');
		
		return collectionData(matchesRef, { idField: 'id' }) as Observable<Match[]>;
	}
	//get match by Id
	getMatchById(id) {
		const matchDocRef = doc(this.firestore, `matches/${id}`);
		
		return docData(matchDocRef, { idField: 'id' });
	}
	//Create new Match
	async createNewMatch(match){
		const matchesRef = collection(this.firestore, 'matches');
		const matchDocRef = await addDoc(matchesRef, match);

		return matchDocRef.id;
	}


	//FIELDS
	//Get field by Id
	getFieldById(id) {
		const fieldDocRef = doc(this.firestore, `fields/${id}`);
		return docData(fieldDocRef, {idField: 'id'});
	}
	//Create new Field
	async createNewField(field){
		const fieldsRef = collection(this.firestore, 'fields');
		const fieldDocRef = await addDoc(fieldsRef, field);

		console.log(fieldDocRef);
		return fieldDocRef.id;
	}


	//USERS
	//Get By Id
	getUserById(id){
		const userDocRef = doc(this.firestore, `users/${id}`);
		return docData(userDocRef, {idField: 'id'});
	}
	//Create new User
	async createNewUser(user){
		const usersRef = collection(this.firestore, 'users');
		const userDocRef = await addDoc(usersRef, user);


		return userDocRef.id;
	}


}
