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

- In progress

## How to run

### Requirements

- Node.js
- npm
- dfx
- Make

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
# in progress
```

6. Stop local network

```bash
make stop
```

## References

- [The Azle Book](https://demergent-labs.github.io/azle/the_azle_book.html)