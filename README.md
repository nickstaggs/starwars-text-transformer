# Star Wars Text Transformer

This application allows users to transform input text into the distinctive speaking style of various Star Wars characters from the original trilogy. It leverages OpenAI's language models to achieve these stylistic transformations, with an optional feature to enhance results by providing relevant contextual quotes from the movies.

## How to Run

To get this application up and running, follow these steps:

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm (Node Package Manager)
*   An OpenAI API Key (set as `OPENAI_API_KEY` in a `.env` file in `packages/backend/`)

### Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository_url>
    cd starwars-text-transformer
    ```
2.  **Install dependencies**:
    Navigate to the root of the project and install all dependencies for the monorepo:
    ```bash
    npm install
    ```
3.  **Generate Embeddings (Backend)**:
    The application uses pre-generated embeddings for contextual transformations. You need to run a script to create these:
    ```bash
    cd packages/backend
    npm run build-embeddings # This script will generate `ot_index.json` in `packages/backend/data/`
    cd ../..
    ```
    *Note: Ensure your `OPENAI_API_KEY` is set in `packages/backend/.env` before running this script.*

### Running the Application

1.  **Start the Backend Server**:
    In the project root, start the backend server:
    ```bash
    npm run start -w text-transformer
    ```
    The API will be running at `http://localhost:3000`.

2.  **Start the Frontend Development Server**:
    In a new terminal, from the project root, start the frontend:
    ```bash
    npm run dev -w frontend
    ```
    The frontend application will typically be available at `http://localhost:5173` (or another port if 5173 is in use).

## Backend Routes

The backend API is built with Node.js and Express, providing the following routes for text transformation:

*   **`/transform-text/stream` (POST)**:
    *   **Description**: Transforms user-provided text into the style of a selected Star Wars character.
    *   **Request Body**:
        *   `style` (string): The name of the Star Wars character (e.g., "Luke Skywalker", "Darth Vader").
        *   `text` (string): The text to be transformed.
    *   **Response**: Streams the transformed text.

*   **`/transform-text/streamWithContext` (POST)**:
    *   **Description**: Transforms user-provided text into the style of a selected Star Wars character, enhanced by providing relevant contextual quotes from the movies. This helps the model generate more accurate and nuanced stylistic transformations.
    *   **Request Body**:
        *   `style` (string): The name of the Star Wars character.
        *   `text` (string): The text to be transformed.
    *   **Response**: Streams the transformed text.

## Embedding Generation

The application utilizes pre-generated embeddings of Star Wars dialogue to provide contextual information for the `/streamWithContext` route. These embeddings are created using the following script:

*   **`packages/backend/scripts/build-embeddings.ts`**:
    *   **Purpose**: This script processes the raw dialogue text files (`Text_files/EpisodeIV_dialogues.txt`, `EpisodeV_dialogues.txt`, `EpisodeVI_dialogues.txt`).
    *   **Process**: It extracts quotes, identifies the speaking character and movie, and then uses OpenAI's embedding model (`text-embedding-3-small`) to generate numerical vector representations (embeddings) for each quote.
    *   **Output**: The generated embeddings, along with the original quote metadata, are saved to `packages/backend/data/ot_index.json`. This JSON file serves as a local database of embedded quotes for context retrieval.
    *   **Execution**: This script can be run using `ts-node`.

