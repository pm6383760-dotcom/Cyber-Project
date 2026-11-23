# 🚀 PhishGuard AI - Complete Step-by-Step Free Cloud Deployment Guide

This guide walks you through deploying **PhishGuard AI** to the cloud using 100% free-tier services:
1. **Database:** MongoDB Atlas (Free M0 Cluster)
2. **Backend API:** Render (Free Web Service)
3. **ML Microservice (Optional):** Render (Free Python Web Service)
4. **Frontend:** Vercel (Free React Vite Hosting)

---

## 🗄️ Step 1: Set Up Free Cloud Database (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Click **Create a Deployment** -> choose **M0 Free Cluster**.
3. Choose any cloud provider & region close to you (e.g., AWS / Mumbai or Frankfurt).
4. **Security & User Setup:**
   - Under **Database Access**, create a user:
     - Username: `phishguard_admin`
     - Password: `YourSecurePassword123!` (Note this down!)
   - Under **Network Access**, click **Add IP Address** -> Select **Allow Access From Anywhere (`0.0.0.0/0`)** -> Confirm.
5. **Get Connection String:**
   - Click **Connect** -> **Drivers** (Node.js).
   - Copy your connection string, which looks like:
     ```
     mongodb+srv://phishguard_admin:<password>@cluster0.abcde.mongodb.net/phishguard?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password.

---

## ⚙️ Step 2: Deploy Backend API on Render

1. Go to [Render.com](https://render.com/) and Sign Up using your **GitHub account (`pm6383760-dotcom`)**.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository: `pm6383760-dotcom/Cyber-Project`.
4. Configure the Web Service settings:
   - **Name:** `phishguard-api`
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. Scroll down to **Environment Variables** and add:
   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `MONGO_URI` | *Your MongoDB Atlas connection string from Step 1* |
   | `JWT_SECRET` | `phishguard_super_secret_jwt_key_2026_prod` |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLIENT_URL` | `*` |
6. Click **Create Web Service**.
7. Wait 2-3 minutes. Once deployment completes, copy your live backend URL (e.g., `https://phishguard-api.onrender.com`).
   - Test it by opening: `https://phishguard-api.onrender.com/api/system/health` in your browser.

---

## 🌐 Step 3: Deploy Frontend on Vercel

1. Go to [Vercel.com](https://vercel.com/) and Sign In with **GitHub**.
2. Click **Add New...** -> **Project**.
3. Import your repository: `pm6383760-dotcom/Cyber-Project`.
4. In the Project Configuration screen:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click **Edit** and select `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Expand **Environment Variables**:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://phishguard-api.onrender.com/api` *(Your Render URL from Step 2 with /api)* |
6. Click **Deploy**.
7. In ~60 seconds, Vercel will give you a live URL (e.g., `https://cyber-project.vercel.app` or `https://phishguard-ai.vercel.app`)!

---

## 🤖 Step 4 (Optional): Deploy Python ML Microservice on Render

> *Note: PhishGuard AI features an automatic dual-engine architecture. If you skip this step, the Node.js backend automatically runs the built-in Random Forest Ensemble Engine with all 22 lexical features. If you want the dedicated Python FastAPI service running in the cloud as well, follow this step:*

1. In Render, click **New +** -> **Web Service**.
2. Select your repository `pm6383760-dotcom/Cyber-Project`.
3. Configure settings:
   - **Name:** `phishguard-ml`
   - **Root Directory:** `ml_service`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt && python train_model.py`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type:** `Free`
4. Click **Create Web Service**.
5. Once live, copy its URL (e.g. `https://phishguard-ml.onrender.com`).
6. Go back to your `phishguard-api` service in Render -> **Environment** tab -> add or edit:
   - `ML_SERVICE_URL` = `https://phishguard-ml.onrender.com`
7. Render will automatically redeploy the backend and connect to your Python ML service!

---

## ✅ Deployment Verification Checklist

- [ ] Open your live Vercel frontend URL.
- [ ] Test the URL Scanner on the landing page or dashboard.
- [ ] Test Login using the **Demo Login** button.
- [ ] Click **Generate Security Report (PDF)** to verify PDF generation.
- [ ] View **Threat Analytics** charts.
- [ ] Present live URL to your college examiners!
