# campr

A small platform allowing (authenticated) users to create, share and review campgrounds - you can think of it as Yelp for campgrounds. 

A user can create an account and then create, adapt and delete his own campground(s). He can add the location, a description and several images to his campground(s).
All authenticated users can review and rate the campgrounds and a great overview over all existing campgrounds is provided through a cluster map.


## Technology

The core of the platform is build with [JavaScript](https://www.javascript.com/), [Node.js](https://nodejs.org/en/) and [Express](https://expressjs.com/). The styling is done with [Bootstrap](https://getbootstrap.com/) and the data persistence is achieved with a [Mongo](https://www.mongodb.com/) database.


## Getting started

To get started, first clone the project using
```shell script
https://github.com/florianbuehler/campr.git
```
Alternatively you can also clone it using SSH `git@github.com:florianbuehler/campr.git`.

Once you cloned the project successfully, navigate into the root project folder and run
```shell script
npm install
```
to install all required packages into the *node_modules* folder.
