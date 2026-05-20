# Requirements

## Core Requirements

1. Authentication
2. User Management

    1. Registration
        - All users sign up for the site
        - Gives MLH data

    b. Admin

    - Check-in/Event Pass
    - Ban

    c. Roles/Permissions

3. Schedule Management
    1. CRUD events
4. Interfaces
    1. Email
    2. Storage
    3. DB
5. CLI Tool
    1. Manage plugins
    2. Initialize project
6. Plugins

## Organization

-   `hackkit/core` hackkit instance exposed by something like `const hk = createHackkit({})` and passing in a config object
-   `hackkit/ui` Hackkit UI package uses the hackkit api exposed by the API
    -   UI components can either be replaced in the web app by the developer or new UI elements can be added into select “slots”
-   `create-hackkit` - Start new hackkit app from template built out with hackkit ui
-   `hackkit` cli - add plugins
