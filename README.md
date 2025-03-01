# File Upload Server with JWT Authentication, Fastify, MongoDB, and Bun

This is a file upload server built using **JWT** for authentication, **Fastify** as the web server framework, **MongoDB** for storing file metadata, and **Bun** as the JavaScript runtime.

## 🚀 Features
- **JWT Authentication**: Secure API access with JWT tokens.
- **File Upload**: Upload files to the server and store metadata in MongoDB.
- **MongoDB**: Store file metadata such as file name, size, and upload date.
- **Bun**: Fast JavaScript runtime to run the server with high performance.

## 📦 Technologies Used
- **Fastify**: A fast web framework for Node.js with built-in support for file uploads.
- **MongoDB**: NoSQL database for storing file metadata.
- **JWT (JSON Web Token)**: Secure authentication mechanism.
- **Bun**: Fast JavaScript runtime for high-performance server-side applications.
- **Fastify Multipart**: Built-in support for handling multipart file uploads.

## 🛠 Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/file-upload-server.git
    ```

2. Navigate to the project directory:
    ```bash
    cd file-upload-server
    ```

3. Install dependencies using Bun (instead of npm):
    ```bash
    bun install
    ```

4. Create a `.env` file to store environment variables (MongoDB URI and JWT secret):
    ```plaintext
    MONGO_URI=mongodb://localhost:27017/file-upload
    JWT_SECRET=your_jwt_secret_key
    ```

5. Run the application using Bun:
    ```bash
    bun run dev
    ```

6. The server will be running at `http://localhost:3000`.

## 🧑‍💻 API Endpoints

### 1. **POST /login**
- **Description**: Get a JWT token by providing valid user credentials.
- **Request Body**:
    ```json
    {
        "username": "your_username",
        "password": "your_password"
    }
    ```
- **Response**:
    ```json
    {
        "token": "your_jwt_token"
    }
    ```

### 2. **POST /upload**
- **Description**: Upload a file to the server.
- **Headers**: Include the JWT token in the `Authorization` header.
    ```plaintext
    Authorization: Bearer your_jwt_token
    ```
- **Form Data**: Use `multipart/form-data` to send the file.
- **Response**:
    ```json
    {
        "message": "File uploaded successfully",
        "file": {
            "filename": "file_name.ext",
            "size": 12345,
            "uploadDate": "2025-03-01T12:00:00Z"
        }
    }
    ```

### 3. **GET /files**
- **Description**: Get a list of uploaded files.
- **Response**:
    ```json
    [
        {
            "filename": "file_name.ext",
            "size": 12345,
            "uploadDate": "2025-03-01T12:00:00Z"
        }
    ]
    ```

## ⚙️ Running in Production
For production deployment, make sure to:
- Use environment variables for sensitive data like MongoDB URI and JWT secret.
- Enable HTTPS for secure communication.
- Set up a file storage system (e.g., Amazon S3, local disk) for storing uploaded files.

## 🤝 Contributing
Feel free to open issues or submit pull requests to contribute to this project.

## 📝 Credits
- **Mukund Hadiya**: Developer of this project.
- **Fastify**: Web framework used for building the API with built-in file upload support.
- **MongoDB**: NoSQL database for storing file metadata.
- **JWT**: Authentication mechanism for secure access.
- **Bun**: JavaScript runtime for high-performance server-side applications.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
