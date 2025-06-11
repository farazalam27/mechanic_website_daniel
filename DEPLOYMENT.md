# Deployment Guide

## Prerequisites
1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a free cluster and get your connection string
3. Install Git if not already installed

## Option 1: Deploy to Render (Recommended - Free)

### Step 1: Prepare your app
1. Update `.env` file with production values:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/daniel_mechanic
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=<choose-secure-password>
   ```

2. Create a `render.yaml` file in root directory (see below)

3. Push to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2: Deploy to Render
1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: `daniels-mechanic-shop`
   - Environment: `Node`
   - Build Command: `npm install && npm run build:full`
   - Start Command: `npm start`
   - Add environment variables from your `.env` file

5. Click "Create Web Service"

## Option 2: Deploy to Heroku

### Step 1: Install Heroku CLI
```bash
# macOS
brew tap heroku/brew && brew install heroku
```

### Step 2: Create Heroku app
```bash
heroku create daniels-mechanic-shop
heroku addons:create mongolab:sandbox
```

### Step 3: Set environment variables
```bash
heroku config:set ADMIN_USERNAME=admin
heroku config:set ADMIN_PASSWORD=your_secure_password
heroku config:set NODE_ENV=production
```

### Step 4: Deploy
```bash
git push heroku main
```

## Option 3: Deploy Frontend and Backend Separately

### Frontend (Vercel)
1. Install Vercel CLI: `npm i -g vercel`
2. In the `client` directory:
   ```bash
   cd client
   echo "REACT_APP_API_URL=https://your-backend-url.com/api" > .env.production
   vercel
   ```

### Backend (Railway/Render)
1. Deploy only the backend to Railway or Render
2. Update frontend's `REACT_APP_API_URL` to point to backend URL
3. Redeploy frontend

## Post-Deployment Steps

1. Test the admin login at `/admin`
2. Create time slots for availability
3. Test appointment booking flow
4. Set up custom domain (optional)

## Environment Variables Summary

Backend needs:
- `MONGO_URI`: MongoDB connection string
- `ADMIN_USERNAME`: Admin login username
- `ADMIN_PASSWORD`: Admin login password
- `NODE_ENV`: Set to "production"
- `PORT`: (Usually provided by hosting platform)

Frontend needs (if deployed separately):
- `REACT_APP_API_URL`: Backend API URL