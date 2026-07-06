---
title: "SQLite Introduction"
---

## Overview

We use SQLite databases to store information that has to last when the page unloads. This includes recordings, waypoints, etc. These databases are typically accessed through python backend code.  

## Using Databases

Use ```get_db_connection()``` to interface the databases. It's best to assign the return value to a variable.  
Use ```get_db_connection().execute("SQL query string").fetchall()``` to query the databases.  
  
[SQL Cheat Sheet](https://www.sqlitetutorial.net/sqlite-cheat-sheet/)
