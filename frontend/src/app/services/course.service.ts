import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { ModelAdapterService } from './model-adapter.service';
import { ErrorService } from './error.service';

export interface Topic {
  _id?: string;
  id?: string; // For frontend use
  title: string;
  content: string;
  course: string | Course;
  courseId?: string; // For backward compatibility with mock data
  likes: number;
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface Course {
  _id?: string;
  id?: string; // For frontend use
  name: string;
  image: string;
  imageUrl?: string; // For backward compatibility with mock data
  description?: string; // For backward compatibility with mock data
  createdAt: string;
  updatedAt: string;
  topics?: Topic[];
}

interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private modelAdapter: ModelAdapterService,
    private errorService: ErrorService
  ) { }

  // Helper method to get authorization headers
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set(
      'Authorization',
      token ? `Bearer ${token}` : ''
    );
  }

  // Get all courses
  getCourses(): Observable<Course[]> {
    return this.http.get<ApiResponse<Course[]>>(`${this.apiUrl}/courses`).pipe(
      map(response => this.modelAdapter.adaptCourses(response.data)),
      catchError(error => {
        this.errorService.handleError(error);
        return throwError(() => new Error(error.error?.error || 'Failed to fetch courses'));
      })
    );
  }

  // Get a single course by ID
  getCourseById(id: string): Observable<Course> {
    return this.http.get<ApiResponse<Course>>(`${this.apiUrl}/courses/${id}`).pipe(
      map(response => this.modelAdapter.adaptCourse(response.data)),
      catchError(error => {
        this.errorService.handleError(error);
        return throwError(() => new Error(error.error?.error || 'Failed to fetch course'));
      })
    );
  }

  // Get topics for a course
  getTopicsByCourseId(courseId: string): Observable<Topic[]> {
    return this.http.get<ApiResponse<Topic[]>>(`${this.apiUrl}/courses/${courseId}/topics`).pipe(
      map(response => this.modelAdapter.adaptTopics(response.data)),
      catchError(error => {
        this.errorService.handleError(error);
        return throwError(() => new Error(error.error?.error || 'Failed to fetch topics'));
      })
    );
  }

  // Get a single topic by ID
  getTopicById(id: string): Observable<Topic> {
    return this.http.get<ApiResponse<Topic>>(`${this.apiUrl}/topics/${id}`).pipe(
      map(response => this.modelAdapter.adaptTopic(response.data)),
      catchError(error => {
        this.errorService.handleError(error);
        return throwError(() => new Error(error.error?.error || 'Failed to fetch topic'));
      })
    );
  }

  // Like or unlike a topic
  toggleLike(topicId: string): Observable<boolean> {
    if (!this.authService.isLoggedIn) {
      this.errorService.showError('You must be logged in to like topics');
      return throwError(() => new Error('You must be logged in to like topics'));
    }

    return this.http.put<ApiResponse<Topic>>(
      `${this.apiUrl}/topics/${topicId}/like`,
      {},
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        // The API should return the updated topic
        return true;
      }),
      catchError(error => {
        this.errorService.handleError(error);
        return throwError(() => new Error(error.error?.error || 'Failed to update like status'));
      })
    );
  }

  // Bookmark or unbookmark a topic
  toggleBookmark(topicId: string): Observable<boolean> {
    if (!this.authService.isLoggedIn) {
      this.errorService.showError('You must be logged in to bookmark topics');
      return throwError(() => new Error('You must be logged in to bookmark topics'));
    }

    return this.http.put<ApiResponse<string[]>>(
      `${this.apiUrl}/users/bookmarks/${topicId}`,
      {},
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        // The API should return the updated bookmarks list
        return true;
      }),
      catchError(error => {
        this.errorService.handleError(error);
        return throwError(() => new Error(error.error?.error || 'Failed to update bookmark status'));
      })
    );
  }

  // Get all bookmarked topics for the current user
  getBookmarkedTopics(): Observable<Topic[]> {
    if (!this.authService.isLoggedIn) {
      this.errorService.showError('You must be logged in to view bookmarks');
      return throwError(() => new Error('You must be logged in to view bookmarks'));
    }

    return this.http.get<ApiResponse<Topic[]>>(
      `${this.apiUrl}/users/bookmarks`,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => this.modelAdapter.adaptTopics(response.data)),
      catchError(error => {
        this.errorService.handleError(error);
        return throwError(() => new Error(error.error?.error || 'Failed to fetch bookmarked topics'));
      })
    );
  }

  // Get all liked topics for the current user
  getLikedTopics(): Observable<Topic[]> {
    if (!this.authService.isLoggedIn) {
      this.errorService.showError('You must be logged in to view liked topics');
      return throwError(() => new Error('You must be logged in to view liked topics'));
    }

    return this.http.get<ApiResponse<Topic[]>>(
      `${this.apiUrl}/users/likes`,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => this.modelAdapter.adaptTopics(response.data)),
      catchError(error => {
        this.errorService.handleError(error);
        return throwError(() => new Error(error.error?.error || 'Failed to fetch liked topics'));
      })
    );
  }

  // Admin methods for creating/editing courses and topics

  // Create a new course (admin only)
  createCourse(courseData: { name: string; image: string }): Observable<Course> {
    return this.http.post<ApiResponse<Course>>(
      `${this.apiUrl}/courses`,
      courseData,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => this.modelAdapter.adaptCourse(response.data)),
      catchError(error => {
        this.errorService.handleError(error);
        return throwError(() => new Error(error.error?.error || 'Failed to create course'));
      })
    );
  }

  // Update a course (admin only)
  updateCourse(id: string, courseData: { name?: string; image?: string }): Observable<Course> {
    return this.http.put<ApiResponse<Course>>(
      `${this.apiUrl}/courses/${id}`,
      courseData,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => this.modelAdapter.adaptCourse(response.data)),
      catchError(error => {
        this.errorService.handleError(error);
        return throwError(() => new Error(error.error?.error || 'Failed to update course'));
      })
    );
  }

  // Delete a course (admin only)
  deleteCourse(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/courses/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => undefined),
      catchError(error => {
        this.errorService.handleError(error);
        return throwError(() => new Error(error.error?.error || 'Failed to delete course'));
      })
    );
  }

  // Create a new topic (admin only)
  createTopic(topicData: { title: string; content: string; course: string }): Observable<Topic> {
    return this.http.post<ApiResponse<Topic>>(
      `${this.apiUrl}/topics`,
      topicData,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => this.modelAdapter.adaptTopic(response.data)),
      catchError(error => {
        this.errorService.handleError(error);
        return throwError(() => new Error(error.error?.error || 'Failed to create topic'));
      })
    );
  }

  // Update a topic (admin only)
  updateTopic(id: string, topicData: { title?: string; content?: string }): Observable<Topic> {
    return this.http.put<ApiResponse<Topic>>(
      `${this.apiUrl}/topics/${id}`,
      topicData,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => this.modelAdapter.adaptTopic(response.data)),
      catchError(error => {
        this.errorService.handleError(error);
        return throwError(() => new Error(error.error?.error || 'Failed to update topic'));
      })
    );
  }

  // Delete a topic (admin only)
  deleteTopic(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/topics/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => undefined),
      catchError(error => {
        this.errorService.handleError(error);
        return throwError(() => new Error(error.error?.error || 'Failed to delete topic'));
      })
    );
  }
}
