import { Injectable } from '@angular/core';
import { Course, Topic } from './course.service';

@Injectable({
  providedIn: 'root'
})
export class ModelAdapterService {
  constructor() {}

  /**
   * Adapts a MongoDB document (with _id) to a frontend model (with id)
   */
  adaptMongoDocument<T extends { _id?: string; id?: string }>(doc: T): T & { id: string } | null {
    if (!doc) return null;
    
    const adapted = { ...doc } as T & { id: string };
    
    // Replace _id with id for frontend compatibility
    if (adapted._id) {
      adapted.id = adapted._id;
      delete adapted._id;
    }
    
    return adapted;
  }

  /**
   * Adapts an array of MongoDB documents
   */
  adaptMongoDocuments<T extends { _id?: string; id?: string }>(docs: T[]): Array<T & { id: string }> {
    if (!docs) return [];
    return docs.map(doc => this.adaptMongoDocument(doc)).filter((doc): doc is T & { id: string } => doc !== null);
  }

  /**
   * Adapts a Course from MongoDB
   */
  adaptCourse(course: any): Course {
    if (!course) return {} as Course; // Return empty object instead of null
    
    const adapted = this.adaptMongoDocument(course);
    
    if (adapted) {
      // Handle property mappings for backward compatibility
      if (adapted.image && !adapted.imageUrl) {
        adapted.imageUrl = adapted.image;
      }
      
      // Set a default description if missing
      if (!adapted.description) {
        adapted.description = '';
      }
      
      // Handle nested topics if they exist
      if (adapted.topics && Array.isArray(adapted.topics)) {
        adapted.topics = this.adaptMongoDocuments(adapted.topics);
      }
    }
    
    return adapted as Course;
  }

  /**
   * Adapts an array of Courses from MongoDB
   */
  adaptCourses(courses: any[]): Course[] {
    if (!courses) return [];
    return courses.map(course => this.adaptCourse(course));
  }

  /**
   * Adapts a Topic from MongoDB
   */
  adaptTopic(topic: any): Topic {
    if (!topic) return {} as Topic; // Return empty object instead of null
    
    const adapted = this.adaptMongoDocument(topic);
    
    if (adapted) {
      // Add courseId for backward compatibility
      if (adapted.course) {
        if (typeof adapted.course === 'string') {
          adapted.courseId = adapted.course;
        } else if (typeof adapted.course === 'object' && adapted.course.id) {
          adapted.courseId = adapted.course.id;
        }
      }
      
      // Handle the course reference if it exists and is a full object
      if (adapted.course && typeof adapted.course === 'object') {
        adapted.course = this.adaptCourse(adapted.course);
      }
    }
    
    return adapted as Topic;
  }

  /**
   * Adapts an array of Topics from MongoDB
   */
  adaptTopics(topics: any[]): Topic[] {
    if (!topics) return [];
    return topics.map(topic => this.adaptTopic(topic));
  }
}