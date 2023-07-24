<div align="center"> <h1>Insight7 task</h1>
 A basic dictionary web app to look for and add to your favourite words. 
 </div>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Overview](#overview)
- [Built With](#built-with)
- [Features](#features)

<!-- OVERVIEW -->

## Overview

I expected this app to be an easy breeze through, because I already pictured the entire project structure in my head. I couldn't be any more wrong. It started gracefully until I started running into nasty bugs, especially since this was my first time using Material UI extensively, which I preferred over the usual Boostrap just for the fun of the challenge. I spent days debugging. At some point, I began to think JavaScript was self-aware. Because I'd close my laptop, having written a perfectly working code. Only to wake up to bugs in the morning. It was so annoying but I learned alot on the task. My ability to work under frustration was really tested.

### Built With

<!-- This section should list any major frameworks that you built your project using. Here are a few examples.-->

- [JavaScript](https://javascript.com/)
- [NodeJS](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://mongodb.com/)
- [Free Dictionary API](https://dictionaryapi.dev/)
- [Magterial UI](https://mui.com/)

## Features

Some of the features include:

- Users can enter any word and press “Go” to get definitions for the word
- Users can log in or sign up for the app, although the app can be used without authentication
- Allow users (both registered and unregistered) to perform only 2 search queries per minute
- Registered users can add and remove words to their "Favorites".
- Only users from Nigeria and the United States to use this application.

## Important Notes

- The main point of the app is the search function. The signup/login features are just UX sugars
- You can only add words to favourite when you're logged in
- The latency is affected by two main factors, the decentralized nature of the service, and cold starts. Since the frontend, backend, and database servers are hosted independently, it is obvious that it would produce higher latency, but eliminates the issue of a single point of failure.
- Some words (e.g. "sky") may not return any results (and even less would return synonyms) do to the unstructured nature of the dictionary API in use. As you can see from examining the backend code, some tweaks were made to prevent this issue as best as possible.

## How To Use

<!-- Example: -->

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/lexNwimue/insight7-task

# Install dependencies & start the app
$ cd /frontend
$ npm install
$ npm run start

$ cd /backend
$ npm install
$ npm run dev

```
