# ICP 01 Hackathon

## Table of Contents

- [Team Members](#team-members)
- [Introduction](#introduction)
- [How to run](#how-to-run)
  - [Requirements](#requirements)
  - [Steps](#steps)
- [References](#references)

## Team Members

| <img src="https://avatars.githubusercontent.com/u/61569834?v=4" width="150" height="150"/> | <img src="https://avatars.githubusercontent.com/u/126757767?v=4" width="150" height="150"/> |
| ------------------------------------------------------------------------------------------ |  ------------------------------------------------------------------------------------------- |
| [piatoss3612](https://github.com/piatoss3612)| [dokpark21](https://github.com/dokpark21)|
| 이효확 | 박상현 |

## Introduction

### Project Name

- You can create your own exhibition and sell your art works
- You can buy tickets to visit other artists' exhibitions
- You can also buy art works from other artists
- You can leave comments on art works and get rewards if your comments are adopted by artists

>  Be a host of your own exhibition with your art works!

### Slides

- [Link](https://docs.google.com/presentation/d/1u_sW8k0BL1nrQkMVXKf9CjOWpev7vhN2o9zdhgJZak8/edit?usp=sharing)

## How to run

### Requirements

- [Node.js](https://nodejs.org/ko/download)
- [npm](https://docs.npmjs.com/getting-started)
- [dfx](https://internetcomputer.org/docs/current/developer-docs/setup/install/)
- [Make](https://www.gnu.org/software/make/)

### Steps

1. Clone this repository

```bash
git clone <this repository>
```

2. Install dependencies

```bash
npm install
```

3. Run local network

```bash
make start
```

or

```bash
make start_clean
```

4. Deploy canister to local network

```bash
# 1. deploy ledger canister
make ledger

# 2. deploy nft canister
make nft

# 3. deploy backend canister
make backend
```

5. Test

```bash
# create exhibition and buy ticket
make create_exhibition

# buy artwork
make buy_artwork exhibition=<exhibition_id> artwork=<artwork_id>
```

6. Stop local network

```bash
make stop
```

## References

- [The Azle Book](https://demergent-labs.github.io/azle/the_azle_book.html)
- [Internet Computer Developer Docs](https://internetcomputer.org/docs/current/developer-docs/)