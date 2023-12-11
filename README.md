# README

## About
This is an exercise designed to give student's an interactive experience with subdomain takeover that they can do legally without having to purchase their own domain. The exercise consists of a domain, artstailor.com, which has an outdated CNAME record pointing the subdomain `irc` to `artstailor.freeirc.io`. FreeIRC is a fictional IRC hosting provider that I created for this exercise, and it allows users to easily change their free subdomain on `freeirc.io` to whatever they like as long as it is not taken by another account. The IRC servers are powered by [Ergo](https://ergo.chat/), which is an [open source](https://github.com/ergochat/ergo) IRC server implementation packed with features.

## Setup

### Download the Code
Clone the git repo for this exercise
```bash
git clone https://github.com/hunterverhelst/subdomain-takeover
```

### Configure the Exercise (Optional)
If you wish to customize the Ergo IRC servers, website login, or target domain/subdomain, you can edit the corresponding configuration files.

For information on how to configure Ergo, visit their [GitHub repo](https://github.com/ergochat/ergo). The motd and yaml files are available to edit in the ergo folders.

To change the website login, edit `web/backend/server/db.json`. Prefix should match the subdomain configured in `dns/config/freeirc`, and the password is a bcrypt hash of the desired password with 10 salt rounds.

To edit the apex domains, you can change `dns/config/Corefile`, and the subdomains can be changed in the corresponding .db file.
### Build and Run
The environment can be build/rebuild using the following command in the root directory of the project:
```bash
docker-compose build
```
The exercise can then be started with:
```bash
docker-compose run
```
### Enter the Exercise
To enter the exercise, create an interactive shell on the attack-box machine:
```bash
docker exec -it subdomain-takeover-attack-box-1 bash
```