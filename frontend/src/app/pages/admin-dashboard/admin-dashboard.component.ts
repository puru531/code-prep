import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CourseService, Course, Topic } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MarkdownService } from '../../services/markdown.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  courses: Course[] = [];
  selectedCourse: Course | null = null;
  topics: Topic[] = [];
  selectedTopic: Topic | null = null;
  loading = true;
  isAdmin = false;
  error = '';
  successMessage = '';
  
  // Forms
  courseForm: FormGroup;
  topicForm: FormGroup;
  
  // Edit mode states
  isEditingCourse = false;
  isEditingTopic = false;
  isCreatingTopic = false;

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    public markdownService: MarkdownService
  ) {
    // Initialize forms
    this.courseForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image: [''] // Changed from imageUrl to image
    });
    
    this.topicForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Check if user is admin
    this.isAdmin = this.authService.isAdmin;

    if (!this.isAdmin) {
      this.router.navigate(['/']);
      return;
    }

    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load courses. Please try again.';
        this.loading = false;
      }
    });
  }

  selectCourse(course: Course): void {
    this.selectedCourse = course;
    if (course.topics) {
      this.topics = course.topics;
    } else if (course.id) { // Add null check for course.id
      this.loading = true;
      this.courseService.getTopicsByCourseId(course.id).subscribe({
        next: (topics) => {
          this.topics = topics;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load topics. Please try again.';
          this.loading = false;
        }
      });
    }
    this.selectedTopic = null;
  }

  selectTopic(topic: Topic): void {
    this.selectedTopic = topic;
    this.isCreatingTopic = false;
    this.isEditingTopic = false;
  }

  // Course management
  startAddCourse(): void {
    this.isEditingCourse = false;
    this.courseForm.reset({
      name: '',
      description: '',
      image: ''  // Changed from imageUrl to image
    });
  }

  startEditCourse(course: Course): void {
    this.isEditingCourse = true;
    this.selectedCourse = course;
    this.courseForm.patchValue({
      name: course.name,
      description: course.description || '',
      image: course.image || course.imageUrl || ''  // Support both properties
    });
  }

  saveCourse(): void {
    if (this.courseForm.invalid) {
      return;
    }

    const courseData = {
      name: this.courseForm.value.name,
      image: this.courseForm.value.image,  // Changed from imageUrl to image
      description: this.courseForm.value.description
    };
    
    if (this.isEditingCourse && this.selectedCourse?.id) {
      // Update existing course
      this.courseService.updateCourse(this.selectedCourse.id, courseData).subscribe({
        next: (updatedCourse) => {
          this.successMessage = `Course "${updatedCourse.name}" has been updated.`;
          setTimeout(() => this.successMessage = '', 3000);
          this.loadCourses();
        },
        error: (err) => {
          this.error = 'Failed to update course.';
        }
      });
    } else {
      // Create new course
      this.courseService.createCourse(courseData).subscribe({
        next: (newCourse) => {
          this.successMessage = `Course "${newCourse.name}" has been created.`;
          setTimeout(() => this.successMessage = '', 3000);
          this.loadCourses();
        },
        error: (err) => {
          this.error = 'Failed to create course.';
        }
      });
    }
    
    this.courseForm.reset();
    this.isEditingCourse = false;
  }

  // Topic management
  startAddTopic(): void {
    if (!this.selectedCourse) return;
    
    this.isCreatingTopic = true;
    this.selectedTopic = null;
    this.isEditingTopic = false;
    
    this.topicForm.reset({
      title: '',
      content: ''
    });
  }

  startEditTopic(): void {
    if (!this.selectedTopic) return;
    
    this.isEditingTopic = true;
    this.isCreatingTopic = false;
    
    this.topicForm.patchValue({
      title: this.selectedTopic.title,
      content: this.selectedTopic.content
    });
  }

  saveTopic(): void {
    if (this.topicForm.invalid || !this.selectedCourse || !this.selectedCourse.id) {
      return;
    }

    const topicData = {
      title: this.topicForm.value.title,
      content: this.topicForm.value.content,
      course: this.selectedCourse.id
    };
    
    if (this.isEditingTopic && this.selectedTopic?.id) {
      // Update existing topic
      this.courseService.updateTopic(this.selectedTopic.id, topicData).subscribe({
        next: (updatedTopic) => {
          this.successMessage = `Topic "${updatedTopic.title}" has been updated.`;
          setTimeout(() => this.successMessage = '', 3000);
          this.selectCourse(this.selectedCourse!);
        },
        error: (err) => {
          this.error = 'Failed to update topic.';
        }
      });
    } else {
      // Create new topic
      this.courseService.createTopic(topicData).subscribe({
        next: (newTopic) => {
          this.successMessage = `Topic "${newTopic.title}" has been created.`;
          setTimeout(() => this.successMessage = '', 3000);
          this.selectCourse(this.selectedCourse!);
        },
        error: (err) => {
          this.error = 'Failed to create topic.';
        }
      });
    }
    
    this.topicForm.reset();
    this.isEditingTopic = false;
    this.isCreatingTopic = false;
  }

  deleteCourse(course: Course, event: Event): void {
    event.stopPropagation();
    if (course.id && confirm(`Are you sure you want to delete the course "${course.name}"?`)) {
      this.courseService.deleteCourse(course.id).subscribe({
        next: () => {
          this.successMessage = `Course "${course.name}" has been deleted.`;
          setTimeout(() => this.successMessage = '', 3000);
          this.loadCourses();
          if (this.selectedCourse?.id === course.id) {
            this.selectedCourse = null;
            this.topics = [];
          }
        },
        error: (err) => {
          this.error = 'Failed to delete course.';
        }
      });
    }
  }

  deleteTopic(topic: Topic): void {
    if (topic.id && confirm(`Are you sure you want to delete the topic "${topic.title}"?`)) {
      this.courseService.deleteTopic(topic.id).subscribe({
        next: () => {
          this.successMessage = `Topic "${topic.title}" has been deleted.`;
          setTimeout(() => this.successMessage = '', 3000);
          if (this.selectedCourse) {
            this.selectCourse(this.selectedCourse);
          }
          this.selectedTopic = null;
        },
        error: (err) => {
          this.error = 'Failed to delete topic.';
        }
      });
    }
  }
}
