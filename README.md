## Installing

1. Project

Clone the repository

```bash
git clone https://github.com/heloqua1103/paw-buddy-be.git
```

Run `npm install` in the project.

```bash
npm install
```

2. Database

- Download [Postgresql][https://www.postgresql.org/download/] and [pgadmin][https://www.pgadmin.org/download/][Optional]
- Login Database Server username `postgres` and password `postgres`
- Create new database with name `paw-buddy`
- Open project
- Create a file with name `.env`. Copy and save

```bash
PORT = 1708
JWT_SECRET_ACCESS_TOKEN = paw-buddy
ACCESS_TOKEN_EXPIRES_IN = 10m
JWT_SECRET_REFRESH_TOKEN = paw-buddy
REFRESH_TOKEN_EXPIRES_IN = 7d
CLOUDINARY_NAME = dwf5uoaqg
CLOUDINARY_KEY = 969669645382666
CLOUDINARY_SECRET = BmAtscYlvgBsKSt17ZUSRENGXJ8
LIMIT_PET = 10
LIMIT_BREED = 5
API_KEY = live_hWLw1JXcmuQClo9t7sNpIAsFDe3F9yB9kEmuNXJsMxvux8pF0rEOUCgJnhdhiF5o
```

- Open terminal of project
- Run `cd src`
- Run `npx sequelize-cli db:migrate`

## Usage

- Run the server in development mode

1. Open project in vscode
2. Insert data into the database

```bash
npm run insert
```

3. Run the server

```bash
npm run start
```

## Test

- Download [Postman][https://www.postman.com/downloads/]
- Open Postman
- Import files into the Postman folder.

<div style="justify-content: center;
    display: flex;
    align-items: center; flex-direction: column; gap: 10px">
<img width="400px" src="https://i.imgur.com/lTNfQMH.jpeg">
<img width="400px" src="https://i.imgur.com/8zIbwC0.jpeg">
</div>

- Use environment

<div style="justify-content: center;
    display: flex;
    align-items: center; flex-direction: column">
<img width="400px" src="https://imgur.com/Zu5Jbnk.jpeg"/>
</div>

## Authors

- [Nguyen Trung Hieu](https://github.com/heloqua1103)
