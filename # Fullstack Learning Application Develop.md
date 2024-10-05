# Fullstack Learning Application Development 

## Project Overview
Create an interactive web-based learning application using Next.js and MongoDB, designed to run smoothly on mobile devices. The app should feature a modern, engaging UI with a focus on user experience.

## Technical Specifications
- Framework: Next.js
- Database: MongoDB Cluster
  - Connection string: mongodb+srv://erzysh1:rlpp0602@cluster0.pfsoc.mongodb.net/
- Deployment: Netlify
- Backend: Next.js API routes

## Key Features

### 1. Todo List
- Interactive and responsive UI/UX design
- CRUD operations for tasks
- Task categorization and priority setting
- Drag-and-drop functionality for task reordering

### 2. API Tester
- Form for entering API URL, HTTP method, and request body
- Well-formatted JSON response display
- Request history storage

### 3. Math Note
- Text editor with LaTeX support for mathematical formulas
- Calculate button to evaluate mathematical expressions
- Note storage and retrieval functionality

### 4. E-Book Manager
- Attractive card-based book list display
- Hierarchical structure: Book > Chapter > Subchapter > Content
- Interactive popup for content display
- CRUD operations for books, chapters, subchapters, and content
- Book search and filter capabilities

## Design Suggestions
- Theme: Modern and minimalist with a focus on readability and ease of use
- Color Palette:
  - Primary: #3498db (Blue)
  - Secondary: #2ecc71 (Green)
  - Accent: #e74c3c (Red)
  - Background: #f5f6fa (Light Gray)
  - Text: #2c3e50 (Dark Blue)
- Typography:
  - Headings: Poppins or Roboto Slab
  - Body: Open Sans or Lato
- Icons: Use a consistent icon set (e.g., Material Icons or Feather Icons)

## General Guidelines
- Implement responsive design for optimal mobile experience
- Use efficient state management (e.g., React Context or Redux)
- Implement user authentication
- Apply lazy loading for optimal performance
- Include smooth animations and transitions for enhanced UX

## Implementation Steps
1. Set up Next.js project with TypeScript
2. Configure MongoDB connection and create necessary schemas
3. Implement user authentication system
4. Develop core features (Todo List, API Tester, Math Note, E-Book Manager)
5. Design and implement responsive UI components
6. Integrate state management solution
7. Implement API routes for backend functionality
8. Add animations and transitions
9. Perform thorough testing (unit, integration, and end-to-end)