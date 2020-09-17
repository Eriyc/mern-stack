This is a MERN Fullstack application built on Next.js, Next.js API Routes, TypeScript, JWT and Mongoose.

## Cloning

First, clone the repo:

```bash
git clone https://github.com/Eriyc/mern-stack.git mern-stack
```

Then, run the development server:

```bash
cd mern-stack
# then
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the Next.js page

## Connecting the database

This project uses MongoDB for storing data. Set up an instance of MongoDB at your preferred provider or on your own. Add your database url as shown below

```bash
env.local

DATABASE=mongodb+srv://user:pass@server
SECRET=JWTSecret
```
