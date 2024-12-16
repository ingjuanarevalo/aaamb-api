# AAAMB LLC REST API - Technical Test for MEAN job position

This project is a **REST API** created with **NodeJS** and **ExpressJS** to handle communications between a **SPA** (Single Page Application) and a **MongoDB** database.

This project was generated using `express generator`, then converted to `TypeScript` and some parts of the original Express Generator structure were modified.

## Prerequisites to run this REST API
- You need to have installed NodeJS version 22.12.0
- You need to have MongoDB installed. Also it is necessary to create an empty DB and to have created an user with `readWrite` permissions in the database.
- You need to create a `.env` file into the root folder with `MONGO_USERNAME`, `MONGO_PASSWORD`, `MONGO_HOST`, `MONGO_PORT` and `MONGO_DATABASE` variables.

## Steps to deploy the REST API in a local environment from scratch
Run the following commands inside the project folder, in order, one by one:

```bash
npm i
npm start
```

If you already have installed all the npm local dependencies, just run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:3000/api/tasks`

You'll see the API returning and array of tasks in JSON format.

## NodeJS and ExpressJS project description
This API is created on the base of ExpressJS and utilizes some additional libraries, such as:

- **cors:** to allow/block cross origin requests.
- **dotenv:** to access to environment variables.
- **lodash:** for efficient array and object manipulation.
- **luxon:** for date management.
- **mongoose:** as an ORM to manage the MongoDB database.
- **morgan:** to log all HTTP requests with timestamps.

The project files are organized into folders, following a consistent naming standard. In the `src` folder, you'll find subfolders like
`bin`, `controllers`, `database`, `enums`, `error`, `interfaces`, `models` and `routes`, each serving a specific purpose:

- **bin:** This folder has the entry point for the application, it is the `www.ts` file.
- **controllers:** Contains all the bussiness logic for performing CRUD operations related to Tasks.
- **database:** Contains the logic for connecting to the MongoDB database.
- **enums:** Enumerations for Task priorities and statuses.
- **error:** Contains the centralized logic for error handling.
- **interfaces:** Interface definitions for Task filter, Task history and Task object itself.
- **models:** Contains the MongoDB schema definition of Task.
- **routes:** Contains the endpoints definitions to handle Tasks operations.

## API Endpoints
```bash
Base URL: http://{host}/api
```
### 1. Create a task
- **Method:** `POST`
- **Endpoint:** `/tasks`
- **Description:** Create a new task in DB.
- **Body (JSON):**
```bash
{
    "title": "Go to the gym", (required)
    "description": "Back and Biceps",
    "status": "pending", (required)
    "priority": "low",
    "dueDate": "2024-12-23T13:00:00.000Z", (required)
    "tags": ["gym", "protein"]
}
```
- **Successful Response (201) (JSON):**
```bash
{
    task: {
        "_id": "67606a6eb980b25df4ba3063",
        "title": "Go to the gym",
        "description": "Back and Biceps",
        "status": "pending",
        "priority": "low",
        "dueDate": "2024-12-23T13:00:00.000Z",
        "tags": [
            "gym",
            "protein"
        ],
        "history": [
            {
                "change": "Task has been created",
                "date": "2024-12-16T17:59:10.526Z",
                "_id": "67606a6eb980b25df4ba3064"
            }
        ],
        "deletedAt": null,
        "createdAt": "2024-12-16T17:59:10.537Z",
        "updatedAt": "2024-12-16T18:01:07.512Z",
        "__v": 4
    }
}
```
- **Posible errors:**
  - `400 Bad Request`: Missing some values or not valid values.
  - `500 Internal Server Error`: Server error.

### 2. Get tasks
- **Method:** `GET`
- **Endpoint:** `/tasks`
- **Query Params (Optional):** `status`, `priority`, `tags`, `startDate`, `endDate` 
- **Description:** Get all tasks from DB given some filters or not. Sorted by dueDate in ascending way.
- **Body:** *No apply*
- **Successful Response (200) (JSON):**
```bash
{
    tasks: [{
        "_id": "67606a6eb980b25df4ba3063",
        "title": "Go to the gym",
        "description": "Back and Biceps",
        "status": "pending",
        "priority": "low",
        "dueDate": "2024-12-23T13:00:00.000Z",
        "tags": [
            "gym",
            "protein"
        ],
        "history": [
            {
                "change": "Task has been created",
                "date": "2024-12-16T17:59:10.526Z",
                "_id": "67606a6eb980b25df4ba3064"
            }
        ],
        "deletedAt": null,
        "createdAt": "2024-12-16T17:59:10.537Z",
        "updatedAt": "2024-12-16T18:01:07.512Z",
        "__v": 4
    }]
}
```
- **Posible errors:**
  - `400 Bad Request`: Not valid values.
  - `500 Internal Server Error`: Server error.

### 3. Get deleted tasks
- **Method:** `GET`
- **Endpoint:** `/tasks/deleted`
- **Query Params (Optional):** `status`, `priority`, `tags`, `startDate`, `endDate` 
- **Description:** Get all deleted tasks from DB given some filters or not. Sorted by dueDate in ascending way.
- **Body:** *No apply*
- **Successful Response (200) (JSON):**
```bash
{
    tasks: [{
        "_id": "67606a6eb980b25df4ba3063",
        "title": "Go to the gym",
        "description": "Back and Biceps",
        "status": "pending",
        "priority": "low",
        "dueDate": "2024-12-23T13:00:00.000Z",
        "tags": [
            "gym",
            "protein"
        ],
        "history": [
            {
                "change": "Task has been created",
                "date": "2024-12-16T17:59:10.526Z",
                "_id": "67606a6eb980b25df4ba3064"
            }
        ],
        "deletedAt": "2024-12-16T19:01:07.512Z",
        "createdAt": "2024-12-16T17:59:10.537Z",
        "updatedAt": "2024-12-16T18:01:07.512Z",
        "__v": 4
    }]
}
```
- **Posible errors:**
  - `400 Bad Request`: Not valid values.
  - `500 Internal Server Error`: Server error.

### 4. Get a task by ID
- **Method:** `GET`
- **Endpoint:** `/tasks/:id`
- **Description:** Get a task from DB given its ID.
- **Body:** *No apply*
- **Successful Response (200) (JSON):**
```bash
{
    task: {
        "_id": "67606a6eb980b25df4ba3063",
        "title": "Go to the gym",
        "description": "Back and Biceps",
        "status": "pending",
        "priority": "low",
        "dueDate": "2024-12-23T13:00:00.000Z",
        "tags": [
            "gym",
            "protein"
        ],
        "history": [
            {
                "change": "Task has been created",
                "date": "2024-12-16T17:59:10.526Z",
                "_id": "67606a6eb980b25df4ba3064"
            }
        ],
        "deletedAt": null,
        "createdAt": "2024-12-16T17:59:10.537Z",
        "updatedAt": "2024-12-16T18:01:07.512Z",
        "__v": 4
    }
}
```
- **Posible errors:**
  - `400 Bad Request`: Missing some values or not valid values.
  - `404 Bad Request`: Task not found in DB.
  - `500 Internal Server Error`: Server error.

### 5. Update a task
- **Method:** `PUT`
- **Endpoint:** `/tasks/:id`
- **Description:** Update a task in DB given its ID.
- **Body (JSON):**
```bash
{
    "title": "Go to the gym", (required)
    "description": "Back and Biceps",
    "status": "pending", (required)
    "priority": "medium",
    "dueDate": "2024-12-23T13:00:00.000Z", (required)
    "tags": ["gym", "protein"]
}
```
- **Successful Response (200) (JSON):**
```bash
{
    task: {
        "_id": "67606a6eb980b25df4ba3063",
        "title": "Go to the gym",
        "description": "Back and Biceps",
        "status": "pending",
        "priority": "medium",
        "dueDate": "2024-12-23T13:00:00.000Z",
        "tags": [
            "gym",
            "protein"
        ],
        "history": [
            {
                "change": "Task has been created",
                "date": "2024-12-16T17:59:10.526Z",
                "_id": "67606a6eb980b25df4ba3064"
            },
            {
                "change": "Priority changed from 'low' to 'medium'.\n",
                "date": "2024-12-16T17:59:50.880Z",
                "_id": "67606a96b980b25df4ba3073"
            },
        ],
        "deletedAt": null,
        "createdAt": "2024-12-16T17:59:10.537Z",
        "updatedAt": "2024-12-16T18:01:07.512Z",
        "__v": 4
    }
}
```
- **Posible errors:**
  - `400 Bad Request`: Missing some values or not valid values.
  - `404 Bad Request`: Task not found in DB.
  - `500 Internal Server Error`: Server error.

### 6. Soft delete a task
- **Method:** `DELETE`
- **Endpoint:** `/tasks/:id`
- **Description:** Soft delete a task from DB given its ID.
- **Body:** *No apply*
- **Successful Response:** 204 - No content
- **Posible errors:**
  - `400 Bad Request`: Missing some values or not valid values.
  - `404 Bad Request`: Task not found in DB.
  - `500 Internal Server Error`: Server error.

### 7. Restore a task
- **Method:** `PATCH`
- **Endpoint:** `/tasks/:id/restore`
- **Description:** Restore a task in DB given its ID.
- **Body (JSON):** *No apply*
- **Successful Response (200) (JSON):**
```bash
{
    task: {
        "_id": "67606a6eb980b25df4ba3063",
        "title": "Go to the gym",
        "description": "Back and Biceps",
        "status": "pending",
        "priority": "medium",
        "dueDate": "2024-12-23T13:00:00.000Z",
        "tags": [
            "gym",
            "protein"
        ],
        "history": [
            {
                "change": "Task has been created",
                "date": "2024-12-16T17:59:10.526Z",
                "_id": "67606a6eb980b25df4ba3064"
            },
            {
                "change": "Priority changed from 'low' to 'medium'.\n",
                "date": "2024-12-16T17:59:50.880Z",
                "_id": "67606a96b980b25df4ba3073"
            },
        ],
        "deletedAt": null,
        "createdAt": "2024-12-16T17:59:10.537Z",
        "updatedAt": "2024-12-16T18:01:07.512Z",
        "__v": 4
    }
}
```
- **Posible errors:**
  - `400 Bad Request`: Missing some values or not valid values.
  - `404 Bad Request`: Task not found in DB.
  - `500 Internal Server Error`: Server error.

### NOTE
I implemented soft delete instead of hard delete. It is a better approach to not lose information, perhaps if some investigation is being carried out.

## Access to live deployed API

The API was deployed to production by using **AWS EC2** technology. The **MongoDB** database is stored in the same server.

The API is accessible via IPV4: [http://3.17.9.242:3000/api](http://3.17.9.242:3000/api)

The image below shows the **AWS EC2** configuration:

![AWSAPIScreenshot](/src/assets/img/aaamb-api-aws.png);


