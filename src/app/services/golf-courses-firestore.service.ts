import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { IGolfCourse } from '../models/golf-course.model';

@Injectable({ providedIn: 'root' })
export class GolfCoursesFirestoreService {
  private readonly firestore = inject(Firestore);
  private readonly userService = inject(UserService);


  async addGolfCourse(newGolfCourse: IGolfCourse): Promise<string> {
    const user = this.userService.user();
    if (!user) throw new Error('User must be signed in to create a golf course');
    const golfCoursesRef = collection(this.firestore, 'golfCourses');
    const docRef = await addDoc(golfCoursesRef, newGolfCourse);
    return docRef.id;
  }


  async getGolfCourseById(id: string): Promise<IGolfCourse | null> {
    const docRef = doc(this.firestore, 'golfCourses', id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    const data = snap.data() as IGolfCourse;
    data.id = snap.id; // Ensure the id field is set
    return { ...data };
  }

  async getAllGolfCourses(): Promise<IGolfCourse[]> {
    const golfCoursesRef = collection(this.firestore, 'golfCourses');
    const snap = await getDocs(golfCoursesRef);
    return snap.docs.map(docSnap => {
      const data = docSnap.data() as IGolfCourse;
      return { ...data, id: docSnap.id };
    });
  }
}
