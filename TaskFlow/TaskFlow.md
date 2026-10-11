\# TaskFlow — Complete Full-Stack Project Development Prompt



\## 1. Your Role



You are a Full-Stack JavaScript developer acting as a patient programming mentor.



Build a complete, functional task management web application called \*\*TaskFlow\*\* using:



\- Next.js with App Router and TypeScript for the frontend.

\- Tailwind CSS for styling.

\- Node.js and Express with TypeScript for the backend.

\- MongoDB Atlas with Mongoose for the database.

\- Zod for data validation.

\- bcrypt for password hashing.

\- JWT-based authentication using secure HTTP-only cookies.

\- Git and GitHub for version control.



The developer has approximately \*\*2–3 months of programming experience\*\*.



Write simple, readable, beginner-friendly code. Explain important decisions and avoid unnecessary abstractions, advanced patterns, or complicated architecture.



The goal is to learn how a real Full-Stack application works, not simply generate code.



\---



\## 2. Project Requirements



Build a responsive task management application that allows users to create accounts, log in, and manage their personal tasks.



Each authenticated user must only access their own tasks.



\### Core Features



1\. User registration.

2\. User login and logout.

3\. Protected dashboard.

4\. Create tasks.

5\. View tasks.

6\. Edit tasks.

7\. Delete tasks.

8\. Update task status.

9\. Set task priority.

10\. Set an optional due date.

11\. Search tasks by title.

12\. Filter tasks by status and priority.

13\. Display task statistics.

14\. Responsive design.

15\. Form validation.

16\. Loading, empty, success, and error states.

17\. Persistent storage using MongoDB.

18\. Deployment-ready configuration.



Do not add unnecessary features such as chat, payments, AI integrations, team collaboration, or complex notification systems.



Keep the first version focused on the essential features.



\---



\## 3. Important Development Rules



Follow these rules throughout the project:



\- Inspect the existing repository before making changes.

\- If the repository is empty, create the project structure from scratch.

\- If code already exists, understand it before modifying anything.

\- Do not delete or replace existing files unnecessarily.

\- Do not generate the entire application in one uncontrolled operation.

\- Implement the project in the phases described below.

\- Complete and test the current phase before moving to the next phase.

\- Keep the code appropriate for a developer with 2–3 months of experience.

\- Use functional React components and standard React hooks where appropriate.

\- Use TypeScript types and interfaces instead of using `any` unnecessarily.

\- Use straightforward functions and clear variable names.

\- Avoid premature abstractions and overengineering.

\- Do not duplicate code unnecessarily.

\- Do not leave important functionality as TODO comments or fake implementations.

\- Do not use hardcoded task data in the final application.

\- Do not claim that a feature works unless it has been implemented and tested.

\- Do not claim that deployment succeeded unless it has actually been verified.

\- Explain new concepts briefly when introducing them.

\- Prefer official documentation when checking library behavior.



If a requirement is unclear, choose the simplest reasonable implementation and document the decision.



If a command fails, investigate and fix the actual cause rather than ignoring the error.



\---



\# PHASE 1 — Project Setup and Frontend



\## 4. Project Structure



Create a single repository with separate frontend and backend directories.



Use the following structure as the target architecture:



taskflow/

\- client/

&#x20; - app/

&#x20;   - login/

&#x20;     - page.tsx

&#x20;   - register/

&#x20;     - page.tsx

&#x20;   - dashboard/

&#x20;     - page.tsx

&#x20;   - layout.tsx

&#x20;   - page.tsx

&#x20;   - globals.css

&#x20; - components/

&#x20;   - TaskCard.tsx

&#x20;   - TaskForm.tsx

&#x20;   - TaskFilters.tsx

&#x20;   - DashboardStats.tsx

&#x20;   - Navbar.tsx

&#x20;   - LoadingState.tsx

&#x20;   - EmptyState.tsx

&#x20; - lib/

&#x20;   - api.ts

&#x20; - types/

&#x20;   - task.ts

&#x20; - package.json

\- server/

&#x20; - src/

&#x20;   - config/

&#x20;     - db.ts

&#x20;   - models/

&#x20;     - User.ts

&#x20;     - Task.ts

&#x20;   - routes/

&#x20;     - auth.routes.ts

&#x20;     - task.routes.ts

&#x20;   - controllers/

&#x20;     - auth.controller.ts

&#x20;     - task.controller.ts

&#x20;   - middleware/

&#x20;     - auth.ts

&#x20;     - errorHandler.ts

&#x20;   - validators/

&#x20;     - auth.schema.ts

&#x20;     - task.schema.ts

&#x20;   - app.ts

&#x20;   - server.ts

&#x20; - package.json

&#x20; - tsconfig.json

&#x20; - .env.example

\- .gitignore

\- README.md



You may add small supporting files when needed, but do not introduce unnecessary architectural layers.



\## 5. Frontend Setup



Set up Next.js with:



\- App Router.

\- TypeScript.

\- Tailwind CSS.

\- ESLint.

\- A simple reusable component structure.



Use the current stable, mutually compatible package versions available in the development environment.



Do not use outdated APIs or copy obsolete configuration examples.



\## 6. UI Design



Create a clean, modern, professional task management dashboard.



\### Design Direction



\- Minimal and functional.

\- Neutral background colors.

\- Dark text on light backgrounds.

\- Optional dark mode only if it can be implemented without delaying core functionality.

\- Consistent spacing and typography.

\- Subtle borders and shadows.

\- Limited use of rounded corners.

\- Clear visual hierarchy.

\- Accessible color contrast.

\- Smooth, restrained transitions.

\- No unnecessary gradients, excessive animations, or random colors.



Suggested palette:



\- Background: `#F7F8FA`

\- Cards: `#FFFFFF`

\- Primary text: `#171717`

\- Secondary text: `#737373`

\- Primary accent: `#4F46E5`

\- Borders: `#E5E7EB`



Use CSS variables for repeated design tokens where practical.



\### Login Page



Include:



\- Application name and simple logo treatment.

\- Email input.

\- Password input.

\- Login button.

\- Link to registration.

\- Client-side validation.

\- Server error messages.

\- Loading state during submission.



\### Registration Page



Include:



\- Name input.

\- Email input.

\- Password input.

\- Confirm password input.

\- Registration button.

\- Link to login.

\- Validation messages.



Never store plaintext passwords.



\### Dashboard Page



Include:



1\. Sidebar or compact navigation.

2\. Welcome message.

3\. Task statistics.

4\. Search input.

5\. Status and priority filters.

6\. Task list.

7\. Create Task button.

8\. Task creation and editing form.

9\. Logout button.



\### Task Card



Each card should display:



\- Task title.

\- Optional description.

\- Status.

\- Priority.

\- Due date.

\- Edit action.

\- Delete action.

\- Status update action.



Make the interface usable on mobile, tablet, and desktop.



\### Dashboard Statistics



Display:



\- Total tasks.

\- Pending tasks.

\- In-progress tasks.

\- Completed tasks.



Calculate the statistics from the user's actual tasks.



Do not use static numbers in the final implementation.



\### Task Form



Fields:



\- Title.

\- Description.

\- Priority.

\- Status.

\- Optional due date.



Validate required fields and show clear errors.



Use the same form for creating and editing tasks when practical.



\---



\# PHASE 2 — Backend Setup



\## 7. Express Server



Create a separate Express application using Node.js and TypeScript.



Responsibilities:



\- Handle API requests.

\- Validate incoming data.

\- Authenticate users.

\- Authorize access to tasks.

\- Communicate with MongoDB.

\- Return consistent JSON responses.

\- Handle unexpected errors.



Create:



\- `src/app.ts` for Express configuration.

\- `src/server.ts` for startup and database connection.

\- `src/config/db.ts` for MongoDB connection.

\- `src/middleware/errorHandler.ts` for centralized error handling.



Add a health endpoint:



`GET /api/health`



Expected response:



`{ "status": "ok" }`



Use an environment-provided port when available, with a local development default of `5000`.



The server must not start successfully if its required database configuration is invalid.



\## 8. Environment Variables



Create a `.env.example` file containing placeholders for:



\- `PORT`

\- `MONGODB\_URI`

\- `JWT\_SECRET`

\- `CLIENT\_URL`

\- `NODE\_ENV`



Create `.gitignore` entries for `.env` files, `node\_modules`, build outputs, and other generated files.



Never commit actual credentials or secrets.



Validate required environment variables when starting the server.



\---



\# PHASE 3 — MongoDB Models



\## 9. User Model



Create a Mongoose User model with:



\- `name`: required string.

\- `email`: required string, normalized and unique.

\- `password`: required hashed password.

\- `createdAt`: automatically managed date.

\- `updatedAt`: automatically managed date.



Use Mongoose timestamps.



Ensure duplicate email registrations are handled gracefully.



Never return the password hash in API responses.



\## 10. Task Model



Create a Mongoose Task model with:



\- `title`: required string, maximum 100 characters.

\- `description`: optional string, maximum 1000 characters.

\- `status`: `todo`, `in\_progress`, or `done`.

\- `priority`: `low`, `medium`, or `high`.

\- `dueDate`: optional date, nullable.

\- `user`: required ObjectId reference to User.

\- `createdAt`: automatically managed date.

\- `updatedAt`: automatically managed date.



Defaults:



\- Status: `todo`.

\- Priority: `medium`.

\- Description: empty string.

\- Due date: null.



Use Mongoose enums for status and priority.



Add an appropriate index on the user reference.



Keep the schema understandable and avoid unnecessary fields.



\---



\# PHASE 4 — Authentication and Security



\## 11. Registration



Implement:



`POST /api/auth/register`



Request:



\- Name.

\- Email.

\- Password.



Requirements:



\- Validate all inputs with Zod.

\- Normalize the email.

\- Validate the password length and basic requirements.

\- Reject duplicate accounts.

\- Hash passwords with bcrypt.

\- Create the user.

\- Issue an authenticated session using a signed JWT stored in an HTTP-only cookie.

\- Return safe user information without the password hash.



Do not trust validation performed only by the frontend.



\## 12. Login



Implement:



`POST /api/auth/login`



Requirements:



\- Validate email and password.

\- Find the user.

\- Compare the submitted password with the stored hash.

\- Return a generic authentication error when credentials are invalid.

\- Issue the JWT in a secure cookie.

\- Return safe user information.



Never return the password or password hash.



\## 13. Authentication Middleware



Create authentication middleware that:



1\. Reads the JWT from the expected cookie.

2\. Verifies its signature and expiration.

3\. Identifies the authenticated user.

4\. Attaches the verified user ID to the request.

5\. Rejects missing, invalid, or expired authentication.



Use proper TypeScript types for the authenticated request.



\## 14. Logout and Current User



Implement:



\- `POST /api/auth/logout`

\- `GET /api/auth/me`



Logout must clear the authentication cookie using matching cookie options.



The current-user endpoint must return the authenticated user's safe profile.



Configure cookie options appropriately for local development and production.



Use `HttpOnly` and `Secure` in production, with a suitable `SameSite` policy.



Because the frontend and backend may use different origins, configure credentialed CORS for the exact frontend origin.



Do not use wildcard origins with credentialed requests.



Account for CSRF protection when using cookies for authentication, particularly in production.



Never store authentication tokens in localStorage.



\---



\# PHASE 5 — Task REST API



\## 15. Required Endpoints



Implement the following endpoints.



\### Tasks



\- `GET /api/tasks`

\- `GET /api/tasks/:id`

\- `POST /api/tasks`

\- `PATCH /api/tasks/:id`

\- `DELETE /api/tasks/:id`



All task endpoints must require authentication.



\### Create Task



Accept:



\- Title.

\- Optional description.

\- Optional priority.

\- Optional status.

\- Optional due date.



Validate the request with Zod.



Derive the owner from the authenticated user, never from a client-supplied user ID.



Return `201 Created` after successful creation.



\### Get Tasks



Return only tasks belonging to the authenticated user.



Support query parameters:



\- `search`

\- `status`

\- `priority`



Examples:



`GET /api/tasks?status=todo`



`GET /api/tasks?priority=high`



`GET /api/tasks?search=study`



`GET /api/tasks?status=done\&priority=medium`



Validate query parameters.



Use safe, bounded search behavior and prevent malformed user input from becoming an unsafe MongoDB query.



Sort tasks consistently, for example by most recently updated.



\### Get a Single Task



Return a task only if it belongs to the authenticated user.



Return `404 Not Found` for a missing task or a task the user is not authorized to access.



\### Update Task



Accept only permitted task fields.



Requirements:



\- Validate the task ID.

\- Validate the request body.

\- Reject invalid enum values.

\- Reject empty or invalid titles.

\- Ensure the task belongs to the authenticated user.

\- Prevent modification of ownership fields.

\- Return the updated task.



\### Delete Task



Requirements:



\- Validate the task ID.

\- Ensure ownership.

\- Delete the task.

\- Return a clear success response.



Never allow one user to read, update, or delete another user's tasks.



\## 16. API Response Format



Use a consistent response format.



Success example:



`{ "success": true, "data": ... }`



Error example:



`{ "success": false, "message": "A clear error message" }`



Use appropriate HTTP status codes:



\- `200`: successful request.

\- `201`: resource created.

\- `400`: invalid request.

\- `401`: unauthenticated.

\- `403`: authenticated but forbidden when appropriate.

\- `404`: resource not found.

\- `409`: duplicate resource when appropriate.

\- `500`: unexpected server error.



Do not expose stack traces, database internals, or secrets to clients in production.



\---



\# PHASE 6 — Frontend and Backend Integration



\## 17. API Client



Create `client/lib/api.ts`.



Centralize API requests in reusable functions.



Use an environment variable such as:



`NEXT\_PUBLIC\_API\_URL`



The API client should:



\- Use the configured API base URL.

\- Send credentials when required by cookie authentication.

\- Parse JSON responses safely.

\- Handle unsuccessful HTTP responses.

\- Return useful error messages.

\- Avoid duplicating request logic.



Never put secrets in `NEXT\_PUBLIC\_` environment variables.



\## 18. Authentication Flow



Implement this user journey:



1\. User opens TaskFlow.

2\. User registers or logs in.

3\. The server issues an HTTP-only authentication cookie.

4\. The frontend requests `/api/auth/me`.

5\. The dashboard displays the authenticated user's tasks.

6\. Unauthenticated users are redirected to login.

7\. The user logs out.

8\. The cookie is cleared and the dashboard becomes inaccessible.



Do not rely only on client-side route protection.



Every protected backend endpoint must independently verify authentication and authorization.



Avoid unnecessary API requests and redirect loops during initial loading.



\## 19. Task Management Integration



Connect the interface to the actual backend.



Implement:



\- Loading states.

\- Empty states.

\- API error handling.

\- Form submission states.

\- Create task.

\- Edit task.

\- Delete task.

\- Change status.

\- Search.

\- Filters.

\- Dashboard statistics.



Refresh or update task data after successful mutations.



Prevent duplicate form submissions while a request is in progress.



Use optimistic updates only if they can be implemented clearly and reliably; otherwise, refetch the data after successful changes.



\## 20. User Experience Requirements



Provide clear feedback when:



\- A task is created.

\- A task is updated.

\- A task is deleted.

\- Login fails.

\- Registration fails.

\- A form contains invalid values.

\- The server is unavailable.

\- No tasks match the current filters.



Use confirmation before destructive actions.



Use semantic HTML and accessible labels.



Ensure the interface remains functional when the task list is empty.



\---



\# PHASE 7 — Validation and Error Handling



\## 21. Zod Validation



Create separate validation schemas for:



\- Registration.

\- Login.

\- Creating tasks.

\- Updating tasks.

\- Task query parameters.



Validate data on the backend even when the frontend already validates it.



Keep validation rules straightforward and reuse schemas where appropriate.



Do not silently accept invalid values.



\## 22. Error Handling



Implement a centralized Express error handler.



Handle common errors, including:



\- Invalid request data.

\- Invalid MongoDB ObjectId.

\- Duplicate email.

\- Invalid or expired JWT.

\- Missing resources.

\- Database connection failures.

\- Unexpected server errors.



The frontend must display useful messages without exposing internal technical details.



\---



\# PHASE 8 — Testing



\## 23. Manual API Testing



Use Postman or Bruno to test every endpoint.



Test these cases:



1\. Successful registration.

2\. Duplicate email registration.

3\. Successful login.

4\. Incorrect password.

5\. Logout.

6\. Accessing protected endpoints without authentication.

7\. Creating a valid task.

8\. Creating a task with an empty title.

9\. Editing an existing task.

10\. Deleting an existing task.

11\. Searching tasks.

12\. Filtering tasks.

13\. Accessing another user's task.

14\. Updating another user's task.

15\. Deleting another user's task.

16\. Requesting a nonexistent task.

17\. Sending invalid IDs.

18\. Sending invalid status or priority values.



Confirm that user ownership is enforced by the backend.



\## 24. Automated Testing



After the basic application works, add:



\- Vitest or Jest for backend unit tests.

\- Supertest for Express API tests.

\- Tests for validation and authentication.

\- Tests for task ownership.

\- Playwright for important browser workflows when practical.



At minimum, automate the most important security and CRUD tests.



Do not claim tests passed unless they were actually executed.



\## 25. Quality Checks



Before completing the project:



\- Run TypeScript checks.

\- Run ESLint.

\- Run available automated tests.

\- Verify the production build.

\- Check browser console errors.

\- Check server logs.

\- Verify responsive layouts.

\- Confirm that no secrets are committed.



Fix errors rather than suppressing them without a valid reason.



\---



\# PHASE 9 — Deployment



\## 26. Deployment Targets



Prepare the application for deployment using:



\- Frontend: Vercel.

\- Backend: Render or another suitable Node.js hosting provider.

\- Database: MongoDB Atlas.

\- Source code: GitHub.



Check the current requirements and available plans before deployment.



\## 27. Production Configuration



Prepare environment variables for:



\- MongoDB connection.

\- JWT signing secret.

\- Frontend URL.

\- Backend API URL.

\- Production mode.

\- Cookie configuration.



Requirements:



\- Never commit real credentials.

\- Restrict CORS to the intended frontend origin.

\- Configure secure cookies correctly.

\- Verify frontend-to-backend connectivity.

\- Verify MongoDB network access and database permissions.

\- Handle production startup errors clearly.

\- Ensure the frontend does not depend on localhost URLs in production.



After deployment, test registration, login, logout, task CRUD, filtering, and authorization using the public application.



\---



\# PHASE 10 — GitHub Documentation



\## 28. README.md



Create a complete README containing:



1\. Project name.

2\. Project description.

3\. Feature list.

4\. Technologies used.

5\. Application architecture.

6\. Project structure.

7\. Prerequisites.

8\. Installation instructions.

9\. Local development instructions.

10\. Environment variable documentation.

11\. API endpoint documentation.

12\. Testing instructions.

13\. Deployment information.

14\. Known limitations.



Do not include credentials, private database URLs, or real secrets.



Include screenshots only if they are available.



Do not invent a live deployment URL.



\## 29. Git Workflow



Use clear, meaningful commits for completed milestones, for example:



\- `chore: initialize frontend and backend`

\- `feat: build dashboard interface`

\- `feat: add task model and API`

\- `feat: implement authentication`

\- `feat: connect frontend to backend`

\- `test: add API tests`

\- `docs: complete project README`



Never commit `.env` files containing real secrets.



\---



\# PHASE 11 — Final Acceptance Criteria



The project is complete only when:



\- Registration works.

\- Login works.

\- Logout works.

\- Passwords are hashed.

\- Protected routes work.

\- Tasks persist in MongoDB.

\- Users can create, read, update, and delete their own tasks.

\- Users cannot access or modify other users' tasks.

\- Search and filters work.

\- Dashboard statistics use real data.

\- Validation works on both client and server.

\- Loading and error states are implemented.

\- The application works on mobile and desktop.

\- The frontend and backend can run independently.

\- Automated tests have been executed where implemented.

\- Production build checks pass.

\- Environment variables are documented.

\- README instructions are accurate.

\- Deployment status is reported honestly.



\---



\# PHASE 12 — How to Work With the Developer



Work incrementally and teach while building.



For each phase:



1\. Explain the goal in a few sentences.

2\. List the files to create or modify.

3\. Implement only the work required for that phase.

4\. Explain important code decisions in simple language.

5\. Run the relevant checks and tests.

6\. Report any failures honestly.

7\. Fix problems before proceeding.

8\. Summarize what was learned.

9\. Identify the next phase.



Do not stop after producing a plan if the coding environment allows implementation.



Do not ask the developer to manually create files that you can safely create yourself.



If user input or credentials are required, request only what is necessary and provide clear setup instructions.



If the environment does not provide access to MongoDB Atlas or deployment credentials, implement the code and explain how to configure those services without pretending they are connected.



\*\*Start now with Phase 1. Inspect the repository, determine what already exists, and implement the frontend foundation. Continue through subsequent phases in order, verifying each milestone and keeping the code understandable for a beginner.\*\*

