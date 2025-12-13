# FED2-SP2-martir2109

Hello there! 👋🏼

My name is Martine Reppesgård Karlsen.

This is my Semester Project 2, submitted during my final year of Frontend Development at Noroff School of Technology and Digital Media.

## 📋 Description

For this semester project we were given the task to create a web application using Noroff's Auction House API. The application allows users with a @stud.noroff.no email address to register, log in and interact with auction listings.

Registered users can manage their profiles, view their available credits, create, update and delete listings, and place bids on listings created by other users. Each listing includes a bid history to ensure transparency throughout the auction process. Unregistered users can browse, search and view listings without logging in.

The application is built using CRUD operations (Create, Read, Update, Delete) and communicates with the API through REST endpoints (GET, POST, PUT, DELETE). It follows a mobile-first approach and features a clean, responsive and user-friendly interface across all devices.

## ✨ Features

- User registration and login (@stud.noroff.no email only)
- Create, update and delete auction listings
- Place bids on other users' listings
- View bid history on listings
- Profile management (banner, avatar, bio)
- View available credits
- Browse and search listings as a guest

## Prototype

Before starting the development of the application, I designed a high-fidelity prototype using Figma. The design follows a mobile-first approach and was later adapted for desktop screen sizes to ensure a consistent and responsive user experience.

🎯 Check out my Figma file: [Here](https://www.figma.com/design/DGiM5bAI54yJvhnbLuHO9I/FED2-SP2-Martine-R-Karlsen?node-id=1-3&t=S8ecdKG5xPkOvJuA-1)

## 🌐 Live website

🎯 Check out the live project: [Auction House](https://fed2-sp2-martir2109.netlify.app/)

## 📸 Website Preview

![Preview of Auction House website](/public/assets/images/auction-house-preview.png)

## 🛠️ Technologies used

- HTML5
- Tailwind CSS (main styling)
- CSS (for Navbar and Folder Tabs)
- TypeScript/ Vanilla JavaScript (ES6 Modules)
- Fetch API
- Vite (development server)
- Netlify (deployment)

## 🗂️ Project structure

```
├── auth
├── footer-links
├── listing
├── profile
├── public
├── src
├── .gitignore
├── .prettierrc
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── tailwind.config.ts
└── vite.config.ts
```

# Getting started

## Install dependencies

```bash
npm install
```

## Run the project (development)

Run the development server with Vite:

```bash
npm run dev
```

## Build the project

```bash
npm run build
```

## Preview the project

```bash
npm run preview
```

## Format all files with prettier

```bash
npm run prettier
```
