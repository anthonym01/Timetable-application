
const mysql = require('mysql');
const fs = require('fs');
const express = require('express');
const port = 1999;
const app = express();

app.get('/', (req, res) => {
    res.setHeader('Acess-Control-Allow-Origin', '*');//allow access control from client, this will automatically handle most media files

    try {
        res.writeHead(200, { 'Content-type': 'text/html' });//200 ok
        fs.readFile('www/index.html', function (err, databuffer) {
            if (err) {
                console.log(err)
            } else {
                res.write(databuffer);
            }
            res.end();//end response
        })
    } catch (err) {
        console.log('Catastrophy on index: ', err)
    }
})

app.get('/*', (req, res) => {
    try {

        res.setHeader('Acess-Control-Allow-Origin', '*');//allow access control from client, this will automatically handle most media files

        if (req.url.indexOf('.css') != -1) {//requestuested url is a css file
            res.setHeader('Content-type', 'text/css');//Set the header to css, so the client will expects a css document
        } else if (req.url.indexOf('.js') != -1) { //requestuested url is a js file
            res.setHeader('Content-type', 'application/javascript');//Set the header to javascript, so the client will expects a javascript document
        } else if (req.url.indexOf('.html') != -1) {//requestuested url is a html file
            res.setHeader('Content-type', 'text/html');//Set the header to html, so the client will expects a html document
        } else {
            //media handled automatically
        }

        fs.readFile(req.url.replace('/', 'www/'), function (err, data) {//read request.url.replace('/', '') file
            if (err) {//error because file not found/inaccesible
                console.log(err)
                //notfoundpage(res, req.url);//show 404 page
            } else {
                res.writeHead(200);//200 ok
                res.write(data);//responsepond with data from file
            }
            res.end();//end responseponse
        })

    } catch (error) {
        res.end('not found')
    }
})

app.listen(port, () => { console.log('Running on port ', port) })



let dbman = {//roll into config handler
    details: { host: '192.168.0.201', user: 'timetable', password: 'ODMdhy9nGyVj!k1M', database: 'timetable' },
    updatemeta: function () {//save last time local configuration was changed
        let metta = {}
    },
    pull: function () {
        let connection = mysql.createConnection(this.details);

        connection.connect();
        console.log('Pulling remote configuration on ', connection);
        connection.query('SELECT data FROM Users WHERE name="testusr" AND password="0000"', function (error, results, fields) {
            if (error) throw error;
            console.log('the returndata is: ', JSON.parse(results[0].data));
        });
        connection.end();
    },
    push: function () {
        let connection = mysql.createConnection(this.details);

        connection.connect();
        connection.beginTransaction(function (err) {
            if (err) { throw err; }

            connection.query(`UPDATE Users SET data =? WHERE name="testusr" AND password="0000"`, JSON.stringify(config.data), function (error, results, fields) {
                if (error) {
                    return connection.rollback(function () {
                        throw error;
                    });
                }
                connection.commit(function (err) {
                    if (err) {
                        return connection.rollback(function () {
                            throw err;
                        });
                    }
                    console.log('comit completed success!', results, fields);
                    connection.end();
                });
            });
        });
    },
    getlastmodified: function () {
        let connection = mysql.createConnection(this.details);

        connection.connect();
        console.log('connected as id ', connection);
        connection.query('SELECT latmodified FROM Users WHERE name="testusr" AND password="0000"', function (error, results, fields) {
            if (error) throw error;
            console.log('the last upload is: ', Date.parse(results[0].latmodified), ' last local edit is: ', Date.now());
        });
        connection.end();
    }
}
