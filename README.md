# 👾 Pac-Man Project -- Personal Portfolio

This Pac-Man project is a small game I created to practice JavaScript
logic, grid-based movement, collision detection, and interactive browser
elements. I wanted to recreate the classic feel of Pac-Man while keeping
the code clean and easy to understand. Building this project helped me
sharpen my understanding of how to manage game loops, handle player
input, animate characters, and interact with HTML elements dynamically.
It also allowed me to experiment with event listeners, CSS styling, and
structuring simple browser-based games from scratch.

------------------------------------------------------------------------

# ⚙️ Features & Technologies

### 🎮 Game Features

-   Classic Pac-Man--style grid movement\
-   Collectible items placed across the map\
-   Smooth arrow-key controls\
-   Collision detection with walls\
-   Score tracking logic\
-   Simple browser-based visuals and animations

### 💻 Technologies Used

-   **HTML5** -- structure and game board layout\
-   **CSS3** -- styling, animations, sprites, and layout\
-   **JavaScript** -- game logic, movement, scoring, collision
    detection, and event handling

### 🧩 Project Files

-   `index.html` -- main page for running the game\
-   `script.js` -- core game logic and movement system\
-   `style.css` -- styling and layout\
-   `images/` -- contains icons and visual assets

------------------------------------------------------------------------

# 📦 How It Works

The game uses a grid-based layout where each square is represented in
the DOM. JavaScript updates Pac-Man's position by responding to
arrow-key input and checking whether the next tile is walkable. When
Pac-Man moves over a pellet, it increases the score and removes the
item. The logic runs inside a simple update loop that continuously
checks movement, collisions, and scoring.
