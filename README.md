# Advanced Memory Game

An engaging web-based memory game with various themes and difficulty levels, designed for a fun and challenging user experience.

## Description

The Advanced Memory Game offers an interactive way to test and improve memory skills with different themes like colors, animals, tech logos, and coding tags. The game features multiple difficulty levels and tracks user scores in a leaderboard.

## Features

- **Multiple Themes**: Choose from Colors, Animals, Tech Logos, and Coding Tags.
- **Difficulty Levels**: Easy, Medium, and Hard levels to suit different players.
- **Leaderboard**: Tracks and displays top scores.
- **Dark Mode**: Switch between light and dark themes.
- **User Profiles**: Save user information and select from existing users.

## Getting Started

### Prerequisites

- A web browser.

### Installing

1. Clone the repository:
    ```bash
    git clone https://github.com/NimnadaUGC/Memory-Game-X.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Memory-Game-X/public
    ```
3. Open `index.html` in your web browser.

### Deployment

1. Ensure the repository is public.
2. Enable GitHub Pages in the repository settings.

## Configuration

### Firebase Setup

To connect the game with your Firebase project for authentication and database services, follow these steps:

1. Visit the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project or select an existing one.
3. Navigate to the project settings to find your Firebase configuration details.
4. Replace the following placeholder values in `script.js` with your actual Firebase project configuration:

    ```javascript
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID",
        measurementId: "YOUR_MEASUREMENT_ID",
        databaseURL: "YOUR_DATABASE_URL"
    };
    ```

5. Ensure you enable Firebase Authentication and the Realtime Database in your Firebase project settings.

### Removing Personal API Keys

Before pushing changes to public repositories or deploying, ensure you remove or replace any personal API keys in the `script.js` to prevent unauthorized use and potential security risks.

## Usage

1. Open the application.
2. Enter your name and select your country.
3. Choose a game theme and difficulty level.
4. Match pairs of cards as quickly as possible.
5. View your score on the leaderboard.

## Contributing

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature/AmazingFeature
    ```
3. Commit your changes:
    ```bash
    git commit -m 'Add some AmazingFeature'
    ```
4. Push to the branch:
    ```bash
    git push origin feature/AmazingFeature
    ```
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons by Font Awesome.
- Game idea inspired by classic memory games.
- Special thanks to Firebase for backend services.
