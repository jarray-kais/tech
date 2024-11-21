# E-commerce Website

This is a full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js), and it includes Elasticsearch for advanced search functionality.

## Features
- **User Authentication:** Secure sign-in and sign-up functionality.
- **Product Management:** Add, update, and remove products.
- **Search and Filters:** Elasticsearch integration for fast and accurate product search.
- **Responsive Design:** Optimized for both desktop and mobile devices.
- **User Management:** Manage user roles and permissions within the platform.
- **Payment Integration:** Secure payment processing with **Flouci** for smooth transactions.
- **Email Notifications:** Automated email notifications for user activities, such as account registration and order confirmation.

## Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/)  (v20.15.0)
- [MongoDB](https://www.mongodb.com/) (locally or via cloud service)
- [Elasticsearch](https://www.elastic.co/elasticsearch/) (locally or via cloud service)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/jarray-kais/tech.git
    ```

2. Navigate to the project directory:

    ```bash
    cd server
    ```

3. Install the dependencies for both the client and server:

    ```bash
    npm run build
    ```

### Scripts

Here are the available scripts you can run:

- **Build:** To build the React frontend, run the following command:

    ```bash
    npm run build
    ```

    This will navigate to the `client` directory, install the necessary packages, and run the build process.

- **Start:** To start the server and run the full application:

    ```bash
    npm start
    ```

    This command will install the server dependencies and start the backend using `server.js`.


### Running the Project

Once you've installed the dependencies and set up the environment variables, run the following command to start the application:

```bash
npm start
