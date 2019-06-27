# Thishabbo

## Getting Started

The requirements with software to developing this is project is as follow

### Webserver

A webserver is needed which includes Apache, PHP and MySQL server
- Xampp is a good choice for this, works on all operating systems (windows, linux and MacOS)

### Database

You need either a MySQL (v5+) or MariaDB (10.2+)
- If you are using xampp, the database will be included and no need to think about it.

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

## Short but quick setup
### Clone
As you are reading this file you do have access to the repository, so start with cloning this project
down to whatever location on your computer as you wish. In this example I will be putting it at:

C:/users/{user}/Desktop/repos which would become -> C:/users/{user}/Desktop/repos/com.thishabbo.web

### Installing
In the project we got 3 folders, one for the back-end (rest), one for front-end (same name) and we got
a scripts folder which contain some goodies, including a installation script which will install both
the back-end and front-end dependencies.

For the database, you need to create a new one in your local SQL server named "thsite".
By default our code uses "root" as username and no password. If you got a different setup
you will have to change it.

After this you will have to use your xampp or whatever web server you got, and point your http://localhost
to (using the example) C:/users/{user}/Desktop/repos/com.thishabbo.web/rest/public

And finally, you need the global angular CLI, so run "npm install -g @angular/cli"

### Starting it

Get your database & web server up and running first!
After this, in the scripts folder you can run the "refresh.sh" script
to fill up the databse with testdata. 

Now start the front-end by going into the folder and run "npm start".

Now if you visit http://localhost:4200 you should have the project running!
Default logins are:
* Tovven / test1234
* test / test1234
* test1234 / test1234

Tovven is the super sitecp account for easier development

## Running the tests

We got 3 different types of tests in this project, we got:
* Unit tests for the Front-end
* Unit tests for the Back-end
* E2E tests which test the full application

Look in the scripts/run_tests.sh file to see how they are ran


## Running the development
If you have passed all the previous steps, what you have to do when you want to run
the application is the following.

1) Set the "localhost" of your webserver to the root of the project in the rest/public catalog
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
