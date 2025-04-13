import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'cp-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  features = [
    {
      title: 'Rich Content Library',
      description: 'Access a comprehensive collection of interview preparation materials for frontend development.',
      icon: 'book'
    },
    {
      title: 'Interactive Learning',
      description: 'Explore topics, bookmark your favorites, and track your progress through the material.',
      icon: 'code'
    },
    {
      title: 'Always Up-to-date',
      description: 'Content is regularly updated to reflect the latest frontend development best practices and interview trends.',
      icon: 'refresh'
    }
  ];
}
