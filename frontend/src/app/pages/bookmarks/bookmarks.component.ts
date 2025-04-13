import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService, Topic, Course } from '../../services/course.service';
import { MarkdownService } from '../../services/markdown.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.scss'
})
export class BookmarksComponent implements OnInit {
  bookmarkedTopics: Topic[] = [];
  selectedTopic: Topic | null = null;
  loading = true;
  error = '';

  constructor(
    private courseService: CourseService,
    public markdownService: MarkdownService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn) {
      this.error = 'You need to be logged in to view your bookmarks.';
      this.loading = false;
      return;
    }

    this.loadBookmarkedTopics();
  }

  loadBookmarkedTopics(): void {
    this.loading = true;
    this.courseService.getBookmarkedTopics().subscribe({
      next: (topics) => {
        this.bookmarkedTopics = topics;
        this.loading = false;
        if (topics.length > 0) {
          this.selectedTopic = topics[0]; // Auto-select first topic
        }
      },
      error: (error) => {
        this.error = 'Failed to load bookmarked topics. Please try again later.';
        this.loading = false;
      }
    });
  }

  selectTopic(topic: Topic): void {
    this.selectedTopic = topic;
  }

  toggleBookmark(topic: Topic, event: Event): void {
    event.stopPropagation();
    if (topic.id) { // Add null check for topic.id
      this.courseService.toggleBookmark(topic.id).subscribe(isBookmarked => {
        if (!isBookmarked) {
          // Remove from local list if un-bookmarked
          this.bookmarkedTopics = this.bookmarkedTopics.filter(t => t.id !== topic.id);
          if (this.selectedTopic?.id === topic.id) {
            this.selectedTopic = this.bookmarkedTopics.length > 0 ? this.bookmarkedTopics[0] : null;
          }
        }
        topic.isBookmarked = isBookmarked;
      });
    }
  }

  toggleLike(topic: Topic, event: Event): void {
    event.stopPropagation();
    if (topic.id) { // Add null check for topic.id
      this.courseService.toggleLike(topic.id).subscribe(isLiked => {
        topic.isLiked = isLiked;
        if (isLiked) {
          topic.likes++;
        } else {
          topic.likes = Math.max(0, topic.likes - 1);
        }
      });
    }
  }

  // Helper method to get course ID for navigation
  getCourseId(topic: Topic): string {
    // Check if courseId is available
    if (topic.courseId) {
      return topic.courseId;
    }
    
    // Check if course is a string (ID)
    if (typeof topic.course === 'string') {
      return topic.course;
    }
    
    // Check if course is an object with ID
    if (typeof topic.course === 'object' && topic.course?.id) {
      return topic.course.id;
    }
    
    // Fallback
    return '';
  }

  // Helper method to display course information
  getCourseDisplay(topic: Topic): string {
    // If course is an object with name
    if (typeof topic.course === 'object' && topic.course?.name) {
      return topic.course.name;
    }
    
    // If courseId is available
    if (topic.courseId) {
      return `ID: ${topic.courseId}`;
    }
    
    // If course is a string (ID)
    if (typeof topic.course === 'string') {
      return `ID: ${topic.course}`;
    }
    
    // Fallback
    return 'Unknown Course';
  }
}
