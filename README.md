# **Front-End Application**

This is the front-end application for managing and interacting with documents and users. The project is built using **Vue 3** and leverages **Element Plus** for UI components.

---

## **Features**

- Upload and manage documents with status filters (e.g., approved, pending, rejected).
- Manage users with a detailed list and filtering options.
- Real-time UI updates after document uploads or user actions.
- Interactive dialogs for document rejection with reasons.
- Role-based button states (e.g., hide buttons for approved/rejected documents).
- Responsive and user-friendly interface.

---

## **Technologies Used**

- **Framework**: Vue 3
- **UI Library**: Element Plus
- **State Management**: Pinia
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS

---

## **Project Structure**

```
src/
├── assets/               # Static assets like images
├── components/           # Reusable Vue components
├── pages/                # Page-level components (e.g., User.vue, Admin.vue)
├── services/             # API service modules (e.g., KYCService.js)
├── store/                # Pinia store modules (e.g., authStore.js)
├── router/               # Vue Router configuration
├── styles/               # Global styles (e.g., Tailwind config)
├── App.vue               # Root Vue component
└── main.js               # Entry point of the application
```

---

## **Setup Instructions**

### **Prerequisites**

- **Node.js** (>= 16.x.x)
- **npm** or **yarn**

### **Installation**

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo-url.git
   ```

2. Navigate to the project directory:

   ```bash
   cd front-end-project
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

---

## **Usage Instructions**

### **Run the Development Server**

To start the development server and preview the app in the browser:

```bash
npm run dev
```

- The app will be available at **http://localhost:3000** (or the specified port in your environment).

### **Build for Production**

To generate optimized production files:

```bash
npm run build
```

- The build output will be available in the `dist/` directory.

---

## **Available Scripts**

- `npm run dev`: Start the development server.
- `npm run build`: Build the app for production.
- `npm run lint`: Lint the codebase using ESLint.

---

## **API Integration**

This application communicates with a back-end server using RESTful APIs. Below are some key API endpoints:

1. **Get All Documents**:

   - **Endpoint**: `/user/getAllKyc/:userId`
   - **Method**: `GET`
   - **Description**: Fetch all documents for a specific user.

2. **Upload Document**:

   - **Endpoint**: `/user/kyc`
   - **Method**: `POST`
   - **Description**: Upload a document with a file and metadata.

3. **Approve Document**:

   - **Endpoint**: `/kyc/approve/:id/:approvedBy`
   - **Method**: `PUT`
   - **Description**: Approve a specific document.

4. **Reject Document**:
   - **Endpoint**: `/kyc/reject/:id`
   - **Method**: `PUT`
   - **Description**: Reject a document with a rejection reason.

---

## **Contributing**

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.
