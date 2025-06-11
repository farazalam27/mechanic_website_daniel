# Full-Stack Deployment Guide

## Prerequisites
1. Create MongoDB Atlas account (free): https://www.mongodb.com/atlas
2. Get your connection string from MongoDB Atlas

## Option 1: Glitch (NO CREDIT CARD!)

### Steps:
1. Go to https://glitch.com
2. Click "New Project" → "Import from GitHub"
3. Paste your repo URL: `https://github.com/farazalam27/mechanic_website_daniel`
4. Once imported, open the `.env` file in Glitch editor
5. Add your environment variables:
   ```
   MONGO_URI=your_mongodb_atlas_connection_string
   NODE_ENV=production
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_secure_password
   ```
6. Your app will auto-deploy!

**URL**: `https://your-project-name.glitch.me`

**Note**: App sleeps after 5 mins of inactivity (wakes in ~30 seconds)

## Option 2: Render (Free Tier - Card for Verification Only)

### Why Render?
- App stays awake 24/7
- Better performance
- Professional hosting

### Steps:
1. Push your code to GitHub
2. Go to https://render.com
3. Click "New +" → "Web Service"
4. Connect GitHub repo
5. Use these settings:
   - Build Command: `npm install && npm run build:full`
   - Start Command: `npm start`
6. Add environment variables in Render dashboard
7. Deploy!

## Option 3: Cyclic.sh

1. Go to https://cyclic.sh
2. Connect GitHub
3. Select your repo
4. Add environment variables
5. Deploy!

## MongoDB Atlas Setup (Required for All Options)

1. Go to https://www.mongodb.com/atlas
2. Create free account
3. Create a free M0 cluster
4. In "Security" → "Database Access":
   - Add new user with password
5. In "Security" → "Network Access":
   - Click "Add IP Address"
   - Allow access from anywhere (0.0.0.0/0)
6. In "Deployment" → "Database":
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Environment Variables Needed

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/daniel_mechanic
NODE_ENV=production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=choose_secure_password
PORT=5001
```

## Post-Deployment

1. Visit your app URL
2. Go to `/admin` and login
3. Create time slots
4. Test booking flow

## Costs Summary

- **Glitch**: FREE forever (with sleep)
- **Render**: FREE 750 hrs/month (no sleep)
- **Cyclic**: FREE with limits
- **MongoDB Atlas**: FREE M0 tier (512MB storage)