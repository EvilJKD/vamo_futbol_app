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

//GEOHASH PARA PROXIMIDAD
import geohash from "ngeohash";

@Injectable({
	providedIn: 'root'
})
export class DataService {

	private lat = 0.00900901; // degrees latitude per km
	private lon = 0.00898303; // degrees longitude per km in the eq

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

	//get matches organized in certain fields
	getMatchesByFields(fields:any[]): Observable<Match[]>{
		const matchesRef = collection(this.firestore, 'matches');

		const q = query(matchesRef, where('match_field', 'in', fields));

		return collectionData(q,{idField: 'id'}) as Observable<Match[]>
	}


	//Create new Match
	async createNewMatch(match) {
		const matchesRef = collection(this.firestore, 'matches');
		const matchDocRef = await addDoc(matchesRef, match);

		return matchDocRef.id;
	}


	//FIELDS
	//Get field by Id
	getFieldById(id) {
		const fieldDocRef = doc(this.firestore, `fields/${id}`);
		return docData(fieldDocRef, { idField: 'id' });
	}
	//Create new Field
	async createNewField(field) {
		const fieldsRef = collection(this.firestore, 'fields');
		const fieldDocRef = await addDoc(fieldsRef, field);

		console.log(fieldDocRef);
		return fieldDocRef.id;
	}

	//Get nearby matches
	getNearbyFields(lat, long, distance) {
		const fieldsRef = collection(this.firestore, 'fields');

		const lowerLat = lat - this.lat * distance;
		const lowerLong = long - this.lon * distance;
		const upperLat = lat + this.lat * distance;
		const upperLong = long + this.lon * distance;

		//Limits
		const lower = geohash.encode(lowerLat, lowerLong);
		const upper = geohash.encode(upperLat, upperLong);



		const q = query(fieldsRef, where('geohash', '>=', lower), where('geohash', '<=', upper));

		return collectionData(q, { idField: 'id' });

	}


	//USERS
	//Get By Id
	getUserById(id) {
		const userDocRef = doc(this.firestore, `users/${id}`);
		return docData(userDocRef, { idField: 'id' });
	}
	//Create new User
	async createNewUser(user) {
		const usersRef = collection(this.firestore, 'users');
		const userDocRef = await addDoc(usersRef, user);


		return userDocRef.id;
	}


}
