# asset-manager
ePort dev task for Software Developer role application

# Task Definition
Develop a small Web App called Asset Manager which does the following;
- Allow a user to login as either Admin or User.
- When Logged in as Admin, get access to Create new users, Create Asset categories,Create Departments, and delete existing Assets
- When Logged in as User, Create new assets. Get access to view only assets you created.
- the following information about an asset should be persisted: Asset Name, Category, Date Purchased, Cost, Department
- The App should have an Admin dashboard for Admin users and User dashboard for other system users

You are free to add any innovative features to enhance this app and show your creativity.

The App should be developed usign Next.js and the database should be Postgresql.
The App should be deployed through Github. The ideal setup is to use Vercel and Supabase.
Vercel can be integrated with Github for automated deployment. When you commit to Github, the app is automatically re-deployed with the newest code.
Supabase is a managed PostgreSQL service.
Both Vercel and Supabase have a free tier which suffice for this task.

You are free to use other cloud hosting providers which can provide the same functionality. Part of the testing will include giving our team write access to your Github repo where they can make a change and confirm the automatic re-deployment of the App.

# Entities
## User
- id
- salutation (enum - Mr, Mrs, Dr, Sir, Madam, Miss)
- firstname
- othernames
- lastname
- roles (enum - admin, user)
- email
- phone
- username
- password
- department_id

## Asset
- id
- name
- description
- serial_number
- category_id
- purchase_date
- cost
- department_id
- user_id
- deleted

## Category
- id
- name

## Department
- id
- name

# Room for improvements
- Add pagination to asset listing
- Add security other than just username and password e.g biometric 
- Encrypt password
- Add barcode/qr code scanning for serial number 
- Generate asset tag from asset details
- Add profile
- Add settings