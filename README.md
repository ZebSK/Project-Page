# ZubbleHome
This messaging app, built using TypeScript and React, allows users to set up a profile and to send and receive messages in real-time. 
It utilises Firebase Firestore, Storage, and Authentication for data storage and authentication.

## Contents
1. [Usage](#usage)
2. [Installation and Running the Project](#installation-and-running-the-project)
   - [Prerequisites](#prerequisites)
   - [Set-up](#set-up)
   - [Running the Application using Emulators](#running-the-application-using-emulators)
   - [Running the Application using Firebase](#running-the-application-using-firebase)
3. [Features](#features)
3. [Acknowledgments](#acknowledgments)


## Usage
The latest version of ZubbleHome can be accessed at https://zubblehome.web.app/

## Installation and Running the Project
### Prerequisites
Before running the application, ensure you have the following dependencies installed:
- Node.js and npm
- Git

### Set-up
To get started with this project, follow these steps:
1. Clone the repository to your local machine using git
```
git clone https://github.com/ZebSK/ZubbleHome.git
```
3. Install project dependencies using npm
```
cd ZubbleHome
npm install
```

### Running the Application using Emulators
This runs the project locally on your machine in development mode 
1. Run the development server and Firebase emulators concurrently
```
npm run dev
```
2. Open your browser and visit http://localhost:5173/ to view the app
3. View the Emulator UI at http://127.0.0.1:4000/               

### Running the Application using Firebase
If you would like to deploy your own Firebase web app using this project, follow these instructions
1. Create a Firebase project:
    - Got to the Firebase console at https://console.firebase.google.com/
    - Add a project and follow the instructions
    - Navigate to "Hosting" to add a new web app to the project
    - In "Authentication" enable and configure Google Sign-In
    - Set-up "Firestore Database" and "Storage" and configure the rules to those found in "config\firestore.rules" and "config\storage.rules" respectively
2. Configure the App with your environment variables
    - Rename '.env.example' to '.env'
    - In the Firebase console, navigate to "Project Settings" > "General" and scroll down to find the Firebase configuration values
    - Use these to populate the '.env' file
    - Update 'firebase.json' and '.firebaserc' to reflect project settings
3. Deploy the application
    ```
    firebase deploy
    ```

## Features
- **Real-time Messaging:** Allows users to send and receive messages in real-time
- **User Profiles:** Users can set up their profiles with customizable profile pictures, names, and info
- **Markdown and LaTeX Support:** Text formatting support on messages


## Acknowledgments 
- This project was inspired by Messenger and Discord messaging apps
- Special thanks to [bitesizing](https://github.com/bitesizing) for their contributions

Contributors:

<a href="https://github.com/ZebSK/Project-Page/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ZebSK/Project-Page" />
</a>
