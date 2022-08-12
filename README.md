# Full stack Todo app With Flask (Python) MVC:
## Overview
* CRUD system app with data base  in form of Todo app .
## What has been done:
* In this application, I combined the API with the regular application ,
For example, when making a task, deleting it,
or updating (complete or not), 
the page is not refreshed because I used AJAX techniques (async, await, fetch)و But when moving between the lists, this is done in a regular manner through the routes .
* You can make a new list, or delete an existing one completely, and you can move between different lists via the Nav Bar .
* You can add, delete or update a task (completed or not) .
## Technologies used in the project:
* HTML 5, CSS 3, JavaScript with AJAX (fetch, async , await) .
* Bootstrap 4.
* Flask frame work (Python) for server side .
* sqlite database.
## To run this app
* after cloning the project:
* 1- make a virtual environment for python by writing this command in cmd `python3 -m venv <any name>` .
* 2- activate the virtual environment by the command `<name of the env folder>\Scripts\activate ` For windows .
* 3- run the command `pip install -r requirements.txt` to install the dependencies. 
* 4- run the command `python run.py` to run the localhost server and navigate to the local host that will appear in the command line,  most likely will be `http://127.0.0.1:5000`. 
