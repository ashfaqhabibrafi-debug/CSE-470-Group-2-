# 🚀 START HERE - Your First Time Setup

## ✅ Good News!
I checked your system and you already have:
- ✅ **Node.js** installed (version 24.12.0)
- ✅ **npm** installed (version 11.6.2)

## 📝 What You Need to Do Now

### Step 1: Set Up MongoDB (Database) - 5 minutes

Since you don't have MongoDB installed locally, we'll use the **FREE cloud version** (MongoDB Atlas). It's easier and doesn't require installation!

**Follow these steps:**

1. **Go to:** https://www.mongodb.com/cloud/atlas/register
2. **Click** "Try Free" or "Sign Up"
3. **Create an account** (use your email)
4. **Choose the FREE plan** (M0 - Shared, Free Forever)
5. **Select a cloud provider** (AWS is fine) and choose a region close to you
6. **Create a cluster** - This takes 3-5 minutes (you'll see "Your cluster is being created")
7. **Create a database user:**
   - Click "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `admin` (or any username you want)
   - Password: Create a strong password (write it down!)
   - Set privileges to "Atlas Admin"
   - Click "Add User"
8. **Allow network access:**
   - In the **left sidebar**, find the **"Security"** section
   - Click **"Network Access"** (it's under Security, below Database Access)
   - Click the green **"Add IP Address"** button (top right)
   - Click **"Allow Access from Anywhere"** (button) - this is easiest for development
   - Click **"Confirm"**
   - Wait a few seconds - you should see `0.0.0.0/0` appear in the list with status "Active"
9. **Get your connection string:**
   - Click "Database" (left sidebar)
   - Click "Connect" button on your cluster
   - Choose "Connect your application"
   - Copy the connection string (it looks like: `mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
   - **IMPORTANT:** Replace `<password>` with your actual password and add database name:
     - Change: `mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/`
     - To: `mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/disaster-management?retryWrites=true&w=majority`

### Step 2: Install Project Dependencies - 2 minutes

Open Terminal (Press `Cmd + Space`, type "Terminal", press Enter) and run:

```bash
# Go to your project folder
cd ~/Documents/CSE-470\[Project\]/backend

# Install backend packages (takes 1-2 minutes)
npm install

# Go to frontend folder
cd ../frontend

# Install frontend packages (takes 1-2 minutes)
npm install
```

Wait for both to finish! You'll know it's done when you see the command prompt again.

### Step 3: Create Configuration File - 1 minute

1. **Create a file named `.env` in the `backend` folder**

   **Option A - Using Terminal:**
   ```bash
   cd ~/Documents/CSE-470\[Project\]/backend
   nano .env
   ```
   Then paste the content below, press `Ctrl + O` to save, `Enter` to confirm, `Ctrl + X` to exit.

   **Option B - Using TextEdit/VS Code:**
   - Open the `backend` folder
   - Create a new file named `.env` (make sure it starts with a dot!)
   - Copy and paste this:

   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/disaster-management?retryWrites=true&w=majority
   NODE_ENV=development
   JWT_SECRET=my-super-secret-key-for-jwt-tokens-12345
   JWT_EXPIRE=30d
   ```

   **Replace in the MONGODB_URI:**
   - `admin` → your MongoDB username (if you used something else)
   - `YOUR_PASSWORD` → the password you created in Step 1
   - `cluster0.xxxxx` → your actual cluster address from the connection string

### Step 4: Start the Backend Server - 30 seconds

In Terminal:

```bash
cd ~/Documents/CSE-470\[Project\]/backend
npm run dev
```

**You should see:**
```
MongoDB Connected: ...
Server is running on port 5000
```

✅ **If you see this, your backend is working!**

⚠️ **Keep this terminal window open!** Don't close it.

### Step 5: Start the Frontend - 1 minute

**Open a NEW Terminal window** (Press `Cmd + T` in Terminal, or open Terminal again)

Then run:

```bash
cd ~/Documents/CSE-470\[Project\]/frontend
npm start
```

⏱️ **Wait 30-60 seconds...**

✅ **Your browser should automatically open to:** `http://localhost:3000`

🎉 **You should see the React app!**

---

## 🎯 Summary - What Should Be Running

You should have:

1. **Terminal Window 1:** Backend server running (shows "Server is running on port 5000")
2. **Terminal Window 2:** Frontend running (shows "Compiled successfully!")
3. **Browser:** Open to http://localhost:3000 showing your app

---

## ❌ If Something Goes Wrong

### Problem: "Cannot connect to MongoDB"
- Check your `.env` file has the correct connection string
- Make sure you replaced `<password>` with your actual password
- Make sure you added `disaster-management` as the database name
- Make sure "Network Access" allows your IP in MongoDB Atlas

### Problem: "npm install" fails
- Make sure you're in the correct folder
- Check your internet connection
- Try again (sometimes npm has temporary issues)

### Problem: "Port 5000 already in use"
- Another program is using port 5000
- Change PORT in `.env` file to 5001 or 5002

### Problem: "Port 3000 already in use"
- React will ask if you want to use another port
- Type `Y` and press Enter

---

## 📚 More Help

- **Detailed Guide:** Read `BEGINNER_GUIDE.md` for comprehensive instructions
- **Quick Reference:** Read `QUICK_START.md` for a condensed version
- **API Documentation:** Read `README.md` for API endpoints

---

## ✅ Checklist

- [ ] MongoDB Atlas account created
- [ ] Database user created
- [ ] Network access allowed
- [ ] Connection string copied
- [ ] Backend dependencies installed (`npm install` in backend folder)
- [ ] Frontend dependencies installed (`npm install` in frontend folder)
- [ ] `.env` file created in backend folder with correct MONGODB_URI
- [ ] Backend server running (`npm run dev` shows "Server is running")
- [ ] Frontend running (`npm start` opens browser)
- [ ] Browser shows the app at localhost:3000

---

**Once everything is running, you can start building your frontend components! Good luck! 🚀**

