# Thishabbo

## Getting Started

The requirements with software to developing this is project is as follow

### Webserver

A webserver is needed which includes Apache, PHP and MySQL server
- Xampp is a good choice for this, works on all operating systems (windows, linux and MacOS)

### Database

You need either a MySQL (v5+) or MariaDB (10.2+)

### NodeJS

NodeJS is used for developing in the front-end and starting the GUI
- Sub: Also install @angular/cli by running "npm install -g @angular/cli" locally

### GIT

Git is a most to develop, this is the versioning software used in the project

### Composer

Composer is a package manager for PHP which is used for fetching the depedency packages
we got in the project.

### Editor

When coding you need to find yourself a good editor/IDE to code in! Down below i will list a few
and my own opinion on them!

##### Intellij

A full IDE with support for relations and speed, extra good support for PHP if you got the ultimate
version which costs money. Without it, i would not use it.

##### VsCode (Visual Studio Code)

Great free, fast, easy to use editor. Great choice for people that will not buy the ultimate
version of Intellij. There are a great repository of plugins which comes in handy when working
both with PHP and Angular/Typescript.

##### Atom / Sublime

More of light weight editor, not the greatest support for a lot of stuff but they are quick
and easy to use!

## Installing
Before running the installations, you need to setup the database!
The database currently is named "thsite" and uses nickname "root" without a password.

Installing the project is not harder then running a simple script.
For the easiest possible way to install, just get into the scripts folder and run
the install.sh script!

Otherwise these are the steps to take:
1) Inside the rest folder
1.1) composer install
1.2) php artisan migrate
1.3) php artisan seed
2) Inside front-end
2.1) npm install

## Running the tests

We got 3 different types of tests in this project, we got:
* Unit tests for the Front-end
* Unit tests for the Back-end
* E2E tests which test the full application


## Running the development
If you have passed all the previous steps, what you have to do when you wanna run
the application is the following.

1) Set the "localhost" of your webserver to the root of the project (not inside rest)
2) Start the webserver
2.1) This will be the host for the back-end stuff (the REST API)
3) Open front-end and run the following command "npm run start"

Now you should be able to visit "http://localhost:4200" to see the application.

## Jobs/Ques
In scripts there is the file "job-runner.sh"
This file will be present in the production produced code.

After everything is setup the following steps should be taken on an update:
- 1 bash -c "exec -a JobRunner nohup ./job-runner.sh &>/dev/null &"
  - To start up the runner again
  - It will kill the previous if exists
