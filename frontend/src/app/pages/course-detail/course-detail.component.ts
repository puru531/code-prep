import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CourseService, Course, Topic } from '../../services/course.service';
import { MarkdownService } from '../../services/markdown.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'cp-course-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent implements OnInit {
  course: Course | undefined;
  topics: Topic[] = [];
  selectedTopic: Topic | undefined;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    public markdownService: MarkdownService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const courseId = params.get('id');
        if (!courseId) {
          throw new Error('Course ID is missing');
        }
        this.loading = true;
        return this.courseService.getCourseById(courseId);
      })
    ).subscribe({
      next: (course) => {
        if (!course) {
          this.error = 'Course not found';
          this.loading = false;
          return;
        }
        
        this.course = course;
        
        // Load topics for this course
        if (course.id) { // Add null check for course.id
          this.courseService.getTopicsByCourseId(course.id).subscribe({
            next: (topics) => {
              this.topics = topics;
              
              // If there are topics, select the first one by default
              if (topics.length > 0) {
                this.selectTopic(topics[0]);
              }
              
              this.loading = false;
            },
            error: (err) => {
              console.error('Error loading topics:', err);
              this.error = 'Failed to load topics. Please try again.';
              this.loading = false;
            }
          });
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error loading course:', err);
        this.error = 'Failed to load course. Please try again.';
        this.loading = false;
      }
    });
  }

  selectTopic(topic: Topic): void {
    this.selectedTopic = topic;
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

  toggleBookmark(topic: Topic, event: Event): void {
    event.stopPropagation();
    if (topic.id) { // Add null check for topic.id
      this.courseService.toggleBookmark(topic.id).subscribe(isBookmarked => {
        topic.isBookmarked = isBookmarked;
      });
    }
  }
  
  // Helper method to get course image URL
  getCourseImage(): string {
    if (!this.course) return '';
    
    // First check imageUrl (from mock data)
    if (this.course.imageUrl) {
      return this.course.imageUrl;
    }
    
    // Then check image (from MongoDB model)
    if (this.course.image) {
      return this.course.image;
    }
    
    return '';
  }
}