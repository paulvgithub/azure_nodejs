
var express = require('express');
var app = express();
var sql = require("mssql");
var conn = require('../conn.js');

const port = process.env.PORT || 1337;
app.listen(port, function () {
    console.log('Server is running..');
});


app.set("view engine","ejs")

//Next three required to get parameter from post
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


//Function to list all maps
app.get('/', function (req, res) { 

var ip = (req.headers['x-forwarded-for'] || '').split(',').pop() || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         req.connection.socket.remoteAddress

     console.log("ip="||ip);


     res.render('mainfrm', { title: 'Express' });  
});



//Function to list only algeria 
app.post('/mapcity', function (req, res) {  

    sql.connect(conn, function (err) {
    
        if (err) console.log(err);

        var request = new sql.Request();

        // Get form parameters         
        var city = req.body.city;

        request.query("SELECT distinct rtrim(county)county, rtrim(city) city, rtrim(state) state "
          + "from dbo.map_zip "
          + "where city like '" + city + "%' ", function (err, result) {
        if (err) 
            {
              console.log(err)
            }
        else if (result.recordsets[0].length !==0)     
          {
             sql.close();
             res.render('mapcity',{route: 'home', mapcity: result.recordset });
          }
        else
          {
            sql.close();
            res.render('mainfrm');
          }
        });
      
    });   

 
});


//Function to list only algeria 
app.get('/mapzip/:county?/:city?', function (req, res) {  

    sql.connect(conn, function (err) {
        
        if (err) console.log(err);

        var request = new sql.Request();

        // Get our form values. These rely on the "name" attributes         
        var county= req.query.county;
        var city= req.query.city;

        request.query("SELECT rtrim(county)county, rtrim(city) city, rtrim(state) state, rtrim(zip_code) zip_code, "
                   + "rtrim(map_lat) map_lat, rtrim(map_long) map_long "
                   + "from dbo.map_zip "
                   + "where county='" +  county + "' "
                   + "and city='" +  city + "' ", function (err, result) {
            if (err) 
                console.log(err)
            else       
                {
                  sql.close();
                  res.render('mapzip', {route: 'home', mapzip: result.recordset });
                }   
         });
               
    });

});


