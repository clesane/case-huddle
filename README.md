
# Support Case Huddle

## Overview
Support Case Huddle is a React application designed to manage support cases and huddle sessions. It allows users to track cases, add huddle sessions, and view detailed information about each case.

## Features
- Add, update, and delete support cases
- Add, update, and delete huddle sessions for each case
- Timer functionality for huddle sessions
- Import cases from a CSV file
- Search and filter cases
- Toggle between table view and detailed view

## Installation
1. Clone the repository:

   git clone https://github.com/clesane/case-huddle.git
 
2. Navigate to the project directory:
  
   cd support-case-huddle
 
3. Install the dependencies:
install
 

## Usage
1. Start the development server:

   npm start

2. Open your browser and navigate to `http://localhost:3000`.

## Example CSV Format
To import cases from a CSV file, the file should have the following structure:



### Example CSV Content

caseNumber,customer,supportEngineer,dateOpened,productServiceArea,issueType,labels
CASE-001,Customer A,John Doe,2024-01-01,Product A,Bug / Defect,"label1,label2"
CASE-002,Customer B,Jane Smith,2024-02-15,Product B,Feature Request,"label3,label4"
CASE-003,Customer C,Emily Johnson,2024-03-20,Product C,Configuration Issue,"label5,label6"


- **caseNumber**: Unique identifier for the case.
- **customer**: Name of the customer.
- **supportEngineer**: Name of the support engineer handling the case.
- **dateOpened**: The date when the case was opened (YYYY-MM-DD format).
- **productServiceArea**: The product or service area related to the case.
- **issueType**: The type of issue (e.g., Bug / Defect, Feature Request, etc.).
- **labels**: Comma-separated labels for the case.

## Components
### HuddleSession
- Manages individual huddle session state and timer functionality.

### CasesTable
- Displays a table of support cases with options to add, view, and delete cases.

### HuddleSessionsTable
- Displays a table of huddle sessions for a selected case.

## Customization
### Theme
The application uses Material-UI's theming system. To customize the theme, edit the `createTheme` object in `App.js`.

### Issue Types
To add or modify issue types, update the `issueTypes` array in `App.js`.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue to discuss any changes.

## License
This project is licensed under the MIT License.


This `README.md` file now includes comprehensive information about the application, installation instructions, usage, an example CSV format, and details on the application's components and customization options.
