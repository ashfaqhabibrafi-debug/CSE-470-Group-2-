# How to Set Up Your .env File

The `.env` file stores your configuration (database connection, secret keys, etc.).

## If Using MongoDB Atlas (Cloud - Recommended)

Replace the content of `.env` with:

```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/disaster-management?retryWrites=true&w=majority
NODE_ENV=development
JWT_SECRET=my-super-secret-key-change-this-in-production-12345
JWT_EXPIRE=30d
```

**Replace:**
- `YOUR_USERNAME` → Your MongoDB Atlas username
- `YOUR_PASSWORD` → Your MongoDB Atlas password  
- `cluster0.xxxxx` → Your actual cluster address from MongoDB Atlas

**Example:**
If your username is `admin`, password is `mypassword123`, and cluster is `cluster0.abc123.mongodb.net`, it would look like:

```env
MONGODB_URI=mongodb+srv://admin:mypassword123@cluster0.abc123.mongodb.net/disaster-management?retryWrites=true&w=majority
```

## If Using Local MongoDB

Keep the default (already set):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/disaster-management
NODE_ENV=development
JWT_SECRET=my-super-secret-key-change-this-in-production-12345
JWT_EXPIRE=30d
```

But make sure MongoDB is running locally first!

## How to Edit the .env File

**Option 1: Using Terminal (nano editor)**
```bash
cd backend
nano .env
```
- Edit the file
- Press `Ctrl + O` to save
- Press `Enter` to confirm
- Press `Ctrl + X` to exit

**Option 2: Using TextEdit**
- Open Finder
- Navigate to your project → backend folder
- Right-click → New Document → Text Document
- Name it `.env` (make sure it starts with a dot!)
- Copy and paste the content above
- Save

**Option 3: Using VS Code**
- Open VS Code
- Open the backend folder
- Create new file named `.env`
- Paste the content
- Save

⚠️ **Important:** Never share your `.env` file! It contains sensitive information.

