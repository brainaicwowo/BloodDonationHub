# 🩸 BloodDonationHub

A full-stack web application designed to connect blood donors with individuals in need of blood, streamlining the process of finding and requesting blood donations.

## Features

  * **Donor Registration:** Donors can register with their name, contact details, and blood group.
  * **Blood Requests:** Requesters can submit an urgent request for a specific blood group for a patient.
  * **Live Donor Count:** The homepage displays a real-time count of available donors for each blood type.
  * **Dynamic Matching:**
      * Donors are notified of requests that match their blood type.
      * Requesters receive updates when matching donors are found.
  * **Simple Dashboards:** Separate, easy-to-use dashboards for both donors and requesters to view their information and notifications.

-----

## Technology Stack

  * **Backend:**
      * Java 17
      * Spring Boot (Spring Web, Spring Data JPA)
      * Maven for dependency management
  * **Database:**
      * H2 In-Memory Database
  * **Frontend:**
      * HTML5
      * CSS3
      * Vanilla JavaScript

-----

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

Make sure you have the following software installed on your computer:

  * **Java Development Kit (JDK) 17** or later
  * **Apache Maven**
  * **Git** for version control

### Installation & Running

1.  **Clone the repository:**
    Open your terminal and run the following command:

    ```bash
    git clone https://github.com/brainaicwowo/BloodDonationHub.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd BloodDonationHub
    ```

3.  **Run the application:**
    Use the Maven wrapper to build and run the Spring Boot application.

    ```bash
    ./mvnw spring-boot:run
    ```

    The backend server will start on port `8080`.

4.  **Access the application:**
    Open your favorite web browser and navigate to:
    **`http://localhost:8080`**

-----

## API Endpoints

The application exposes the following RESTful endpoints:

| Method | Endpoint         | Description                   |
| :----- | :--------------- | :---------------------------- |
| `POST` | `/api/donors`    | Registers a new donor.        |
| `GET`  | `/api/donors`    | Retrieves a list of all donors. |
| `POST` | `/api/requests`  | Creates a new blood request.  |
| `GET`  | `/api/requests`  | Retrieves a list of all requests. |

You can also view the H2 in-memory database console by navigating to `http://localhost:8080/h2-console` and using the credentials from the `application.properties` file.
