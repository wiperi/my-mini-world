

export default `
my_information:
  name: Tian
  degree: Computer Science
  year: seond year

  hobby:
    - guitar: I love playing metal. My favorite band is Metallica. I have a Les Paul and I'm saving money for a Marshall JCM800. I once went to an Iron Maiden gig in Sydney last year. I was so excited.
    - hiking: One day, a friend woke me up at 2 AM to go hiking. Against my better judgment, I went. Unfortunately, it was cloudy the next day, and we didn't see the sunrise. However, it turned out to be the most interesting hiking experience. Of course, I skipped class the next day because I was too exhausted.
    - gaming: I enjoy FPS and RPG games, especially competitive FPS like CS, the finals etc. One of the biggest joys of FPS games is playing with friends.

projects:
  - name: Project Amandine
    role: Full Stack Developer
    website: http://amandine.tian77.me
    description: Inspired by COMP1531. A web-based multiplayer online quiz game. Implemented user login and registration, quiz game creation, management, editing, playing, data statistics, and display functions. Consists of a single-page admin management page and an interactive dynamic game page.
    modules:
    - name: Backend
      role: Team Leader
      website: https://github.com/wiperi/Amadine-Backend
      duration: July 2024 - November 2024
      tech_stack: Express, Typescript, Jest, JWT
      responsibilities:
        - Data structure design and core functionality implementation
        - Refactoring and optimizing project structure
        - Requirement distribution, code review, project management, and guiding team members
      highlights:
        - Test-driven development with Jest, comprehensive API interface tests, including time-related API tests, with 95%+ branch coverage
        - State management using a generic finite state machine to ensure legality checks and side effects triggering during game state transitions, ensuring type safety
        - Error handling with custom HttpError class and Express Error Handler middleware for unified error handling
        - Session management using JWT for multi-point login/logout and automatic token refresh
        - API version iteration with route splitting and authentication middleware to support multiple API versions
        - Type safety with a comprehensive type system based on API documentation, avoiding explicit any type, ensuring type safety
        - Log management using winston for server log level management and periodic cleanup
    - name: Frontend
      role: Individual Project
      website: https://github.com/wiperi/Amadine-Frontend
      duration: July 2024 - November 2024
      tech_stack: React, Redux, Ant-Design, Typescript, Axios, TailwindCSS, CRA
      highlights:
        - Complex nested forms using Ant Design Pro components for draggable, editable, expandable (sub-forms) form items with data validation, simplifying user browsing and editing operations
        - Performance optimization with useMemo to reduce component re-renders caused by API polling
        - Data-driven views with redux asynchronous tasks to handle frontend-backend data interaction logic, isolating component code and API calls, ensuring data consistency
        - Deployment using Nginx and pm2 for frontend-backend deployment, configuring backend route redirection to support history routing mode
        - Login state management with redux and route guards for persistent user information storage and access control
        - State updates with periodic requests and context components for API polling mechanism to update game state
        - Responsive layout using grid and flex layout to ensure game page compatibility with multiple devices

  - name: NovusCRM
    role: Backend Developer
    website: https://github.com/wiperi/NovusCRM
    description: A web-based CRM system for managing customer relationships. Still in development.
    tech_stack: Java, Spring Boot, MySQL, Mybatis
    highlights:
      - Leveraged MyBatis for dynamic queries, enabling complex multi-condition searches
      - Secured the application with Spring Security for robust access management
      - Set up monitoring capabilities using Spring Boot Admin
      - Automated API documentation with Swagger for seamless integration
      - Utilized Apifox for streamlined API management and testing
      - Deployed the application in containers using Docker for efficient scalability
`