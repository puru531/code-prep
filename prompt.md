# Functional and Technical Requirements Document for 'CodePrep'

This is going to a frontend interview preparation application.

## Functional Requirements

### Common Features
1. **Landing Page**:
   - A modern and attractive hero section.
   - A header and footer.
   - Footer includes: "This site is developed and managed by Purushhottam Kumar" with GitHub, LinkedIn, and email icons.
   - **Dark Mode/Light Mode Toggle**: Users can switch between dark and light modes.

### Admin Features
1. **Admin Dashboard**:
   - Displays a list of all courses with editable course names and images.
   - Allows clicking on a course to view topics and associated `.md` files.
   - Enables downloading, re-uploading, and editing `.md` files with a side-by-side preview.
   - Updates the database upon saving changes.

2. **Course Management**:
   - Admin can log in and create new courses by providing a course name and image.
   - After course creation, admin can add topics and upload associated `.md` files (re-uploadable, downloadable and editable later).

### Visitor Features
1. **Courses Page**:
   - Displays tiles/cards for all courses with images and names.
   - Allows users to explore courses and read `.md` file content for topics without logging in.
   - Provides proper course and topic-wise routing for sharing specific topic pages.

2. **Bookmarking and Liking**:
   - Logged-in users can bookmark or like topics.
   - Bookmarked topics are accessible under the main menu.
   - Prompts login if a user tries to bookmark without being logged in.

---

## Technical Requirements

### Frontend
- **Framework**: Angular (latest version as per [Angular Overview](https://angular.dev/overview)).
- **CSS Framework**: Tailwind CSS (latest version as per [Tailwind CSS Angular Guide](https://tailwindcss.com/docs/installation/framework-guides/angular)).
- **Features**:
  - Responsive design for all devices.
  - Routing for course and topic pages.
  - Bookmark and like functionality for logged-in users.
  - **Dark Mode/Light Mode**: Implement a toggle to switch between dark and light themes using Tailwind CSS.
  - **Accessibility Compliance**: Ensure the application adheres to WCAG (Web Content Accessibility Guidelines) standards for complete accessibility compliance.

### Backend
- **Framework**: Node.js (latest version 22) with Express (latest version 5 as per [Express Installation](https://expressjs.com/en/starter/installing.html)).
- **Features**:
  - RESTful APIs for managing courses, topics, and user interactions.
  - Authentication and authorization for admin and logged-in users.

### Database
- **Preferred Options**: MongoDB or PostgreSQL (latest free-tier versions).
- **Features**:
  - Stores course details, topics, and `.md` file content.
  - Tracks user bookmarks and likes.

---

## Additional Notes
- Ensure the application is scalable and secure.
- Use modern UI/UX practices for a seamless user experience.
- Implement proper error handling and logging mechanisms.
- Use Tailwind CSS for styling and theme management.
- Ensure the application is fully accessibility compliant.
- Use best coding practices
- use ng generate commands to generate components, services, etc..
- don't skip tests
