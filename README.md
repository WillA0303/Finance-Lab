https://willa0303.github.io/Finance-Lab

\# Finance Lab



A minimal, static learning web app for finance and accounting fundamentals. Built with React + Vite + TypeScript and designed to deploy to GitHub Pages.



\## Features

\- Learn and In Practice modes with short, focused sessions.

\- 7–8 question sessions with immediate feedback and explanations.

\- Progress saved to `localStorage` only (no backend).

\- XP, streak tracking, and stars per skill per mode.

\- ACA-relevant framing with original content.



\## Local development

```bash

npm install

npm run dev

```



\## Build

```bash

npm run build

```



\## Deploy to GitHub Pages

1\. Push to a GitHub repository.

2\. Enable GitHub Pages in \*\*Settings → Pages\*\* and set the source to \*\*GitHub Actions\*\*.

3\. The included workflow will build and deploy on each push to `main`.



\## Change the repo name (base path)

Vite uses a base path for GitHub Pages deployments. The config reads the repository name from the `GITHUB\_REPOSITORY` environment variable in CI. If you rename the repo:



1\. Update the repository name on GitHub.

2\. The workflow will automatically set the correct base path on the next build.

3\. For local preview with a custom base path, you can set:



```bash

GITHUB\_PAGES=true GITHUB\_REPOSITORY=org/new-repo npm run build

```



\## Content JSON schema

All content is defined in `src/content/content.json`.



```json

{

&nbsp; "modules": \[

&nbsp;   {

&nbsp;     "id": "string",

&nbsp;     "title": "string",

&nbsp;     "description": "string",

&nbsp;     "skills": \[

&nbsp;       {

&nbsp;         "id": "string",

&nbsp;         "title": "string",

&nbsp;         "description": "string",

&nbsp;         "questions": \[

&nbsp;           {

&nbsp;             "id": "string",

&nbsp;             "mode": "learn | practice | both",

&nbsp;             "type": "mcq | numeric",

&nbsp;             "difficulty": 1 | 2 | 3,

&nbsp;             "prompt": "string",

&nbsp;             "scenarioContext": "string (optional)",

&nbsp;             "options": \[{ "id": "string", "text": "string" }] (mcq only),

&nbsp;             "answer": "string | number",

&nbsp;             "numericTolerance": "number (optional)",

&nbsp;             "explanation": "string",

&nbsp;             "inPractice": "string (optional)",

&nbsp;             "examTip": "string (optional)",

&nbsp;             "tags": \["string"] (optional)

&nbsp;           }

&nbsp;         ]

&nbsp;       }

&nbsp;     ]

&nbsp;   }

&nbsp; ]

}

```



\## LocalStorage state model

Stored under `financeLabState:v1`.



```json

{

&nbsp; "xpTotal": 0,

&nbsp; "streakCount": 0,

&nbsp; "lastCompletedDate": "YYYY-MM-DD or null",

&nbsp; "modules": {

&nbsp;   "moduleId": {

&nbsp;     "skills": {

&nbsp;       "skillId": {

&nbsp;         "learn": { "bestScore": 0, "stars": 0, "sessionsCompleted": 0 },

&nbsp;         "practice": { "bestScore": 0, "stars": 0, "sessionsCompleted": 0 }

&nbsp;       }

&nbsp;     }

&nbsp;   }

&nbsp; },

&nbsp; "weakQuestionIds": \[],

&nbsp; "lastSession": {

&nbsp;   "mode": "learn | practice",

&nbsp;   "moduleId": "string",

&nbsp;   "skillId": "string",

&nbsp;   "startedAtISO": "string",

&nbsp;   "completedAtISO": "string",

&nbsp;   "questionResults": \[

&nbsp;     { "questionId": "string", "correct": true, "userAnswer": "string", "correctAnswer": "string" }

&nbsp;   ]

&nbsp; }

}

```

