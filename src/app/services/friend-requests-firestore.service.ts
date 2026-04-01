
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, CollectionReference, DocumentData, doc, getDoc, query, where, getDocs } from '@angular/fire/firestore';
import { IFriendRequest } from '../models/friend-request.model';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class FriendRequestsFirestoreService {
	private readonly firestore = inject(Firestore);
	private readonly userService = inject(UserService);

	async sendFriendRequest(toUserId: string): Promise<string> {
		const user = this.userService.user();
		if (!user) throw new Error('User must be signed in to send a friend request');
		const requestsRef = collection(this.firestore, 'friendRequests');
		const docRef = await addDoc(requestsRef, {
			fromUserId: user.uid,
			toUserId,
			// status: 'pending',
			// createdAt: new Date().toISOString(),
			// updatedAt: new Date().toISOString()
		});
		return docRef.id;
	}

	async getFriendRequestById(id: string): Promise<IFriendRequest | null> {
		const docRef = doc(this.firestore, 'friendRequests', id);
		const snap = await getDoc(docRef);
		if (!snap.exists()) return null;
		const data = snap.data() as IFriendRequest;
		return { id: snap.id, fromUserId: data.fromUserId, toUserId: data.toUserId };
	}

	async getFriendRequestsForCurrentUser(): Promise<IFriendRequest[]> {
		const user = this.userService.user();
		if (!user) return [];
		const requestsRef = collection(this.firestore, 'friendRequests');
		const q = query(requestsRef, where('toUserId', '==', user.uid));
		const snap = await getDocs(q);
		return snap.docs.map(docSnap => {
			const data = docSnap.data() as IFriendRequest;
			return { id: docSnap.id, fromUserId: data.fromUserId, toUserId: data.toUserId };
		});
	}
}
