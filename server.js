
var mysql = require('mysql');


var connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "pass",
    database: "autolizingdb"
});
const express = require("express");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});
 
const app = express();
 
app.set("view engine", "ejs");
 
app.get("/index/:filter", function(request, response){
     
    if(request.params.filter == "AZ")
    {
        connection.query("SELECT automobile.IDAutomobile, marku.MarkaName, model.NameModel, automobile.YearVupysky, automobile.Probig, paluvo.Tippaluva, kuzov.TipKuzova FROM automobile, marku, model, paluvo, kuzov where automobile.IDMarka = marku.IDMarku and marku.IDModelAuto = model.IDModel and automobile.IDPaluva = paluvo.IDPaluvo and automobile.IDKuzova = kuzov.IDKuzov and automobile.Dostup = 1 ORDER BY marku.MarkaName;", function(err, results) {
            if(err) console.log(err);
            response.render("index", 
            {
                title: "AUTOMONEY",
                res: results
            });
        });
    }
    else if(request.params.filter == "year")
    {
        connection.query("SELECT automobile.IDAutomobile, marku.MarkaName, model.NameModel, automobile.YearVupysky, automobile.Probig, paluvo.Tippaluva, kuzov.TipKuzova FROM automobile, marku, model, paluvo, kuzov where automobile.IDMarka = marku.IDMarku and marku.IDModelAuto = model.IDModel and automobile.IDPaluva = paluvo.IDPaluvo and automobile.IDKuzova = kuzov.IDKuzov and automobile.Dostup = 1 ORDER BY automobile.YearVupysky;", function(err, results) {
            if(err) console.log(err);
            response.render("index", 
            {
                title: "AUTOMONEY",
                res: results
            });
            
          // connection.end();
        });
    }
    else if(request.params.filter == "probig")
    {
        connection.query("SELECT automobile.IDAutomobile, marku.MarkaName, model.NameModel, automobile.YearVupysky, automobile.Probig, paluvo.Tippaluva, kuzov.TipKuzova FROM automobile, marku, model, paluvo, kuzov where automobile.IDMarka = marku.IDMarku and marku.IDModelAuto = model.IDModel and automobile.IDPaluva = paluvo.IDPaluvo and automobile.IDKuzova = kuzov.IDKuzov and automobile.Dostup = 1 ORDER BY automobile.Probig;", function(err, results) {
            if(err) console.log(err);
            response.render("index", 
            {
                title: "AUTOMONEY",
                res: results
            });
            
          // connection.end();
        });
    }
    else
    {
        connection.query("SELECT automobile.IDAutomobile, marku.MarkaName, model.NameModel, automobile.YearVupysky, automobile.Probig, paluvo.Tippaluva, kuzov.TipKuzova FROM automobile, marku, model, paluvo, kuzov where automobile.IDMarka = marku.IDMarku and marku.IDModelAuto = model.IDModel and automobile.IDPaluva = paluvo.IDPaluvo and automobile.IDKuzova = kuzov.IDKuzov and automobile.Dostup = 1 ORDER BY marku.MarkaName;", function(err, results) {
            if(err) console.log(err);
            response.render("index", 
            {
                title: "AUTOMONEY",
                res: results
            });
            
          // connection.end();
        });
    }

    
});

app.get("/finish", function(req, res){
    res.render("finish", {
        title: "AUTOMONEY"
    });
});


app.get("/page/:autoID", function(request, response){

    connection.query("SELECT automobile.IDAutomobile, marku.MarkaName, model.NameModel, automobile.YearVupysky, automobile.Probig, paluvo.Tippaluva, kuzov.TipKuzova, automobile.CinaPerMounth, automobile.CinaVukypy, classes.ClassName FROM automobile, marku, model, paluvo, kuzov, classes where automobile.IDAutomobile = " +request.params.autoID + " and automobile.IDMarka = marku.IDMarku and marku.IDModelAuto = model.IDModel and automobile.IDPaluva = paluvo.IDPaluvo and automobile.IDKuzova = kuzov.IDKuzov and automobile.IDClassAuto = classes.IDClasses;", function(err, results) {
        if(err) console.log(err);
        response.render("page", 
        {
            title: "AUTOMONEY",
            res: results[0]
        });
        // connection.end();
    });
});


app.post("/page/:autoID", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    // response.redirect("../index");
    console.log(request.params.autoID);
    connection.query("INSERT INTO autolizingdb.client(ClientName, ClientFam, ClientPoBat, ClientTelNumber, ClientEmail, PravaCategory, NomerTaSeiaPasport, DataVidachi, CimVidanui, ClientAddress, NumberOfPrava, InficatsKod) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);", [request.body.user_name, request.body.user_fam, request.body.user_pobat, request.body.phone_number, request.body.user_mail, request.body.user_kategory, request.body.user_nomertaseriapassporta, request.body.user_data, request.body.user_kimvidanii, request.body.user_addres, request.body.user_nomerprav, request.body.user_idef], function(err, result){
        if(err) 
        {
            console.log(err)
        }
        else {
            console.log(request.body.vukup);
            connection.query("SELECT IDClient FROM client ORDER BY IDClient DESC LIMIT 1;", function(err, ressa){
                console.log(ressa);
                connection.query("INSERT INTO autolizingdb.dogovir(DatestartDogovor, DateEndDogovor, IDklient, IDprocivnuk, IDauto, ProvoVikupa) VALUES(?, ?, ?, ?, ?, ?)", [request.body.start_data, request.body.end_data, ressa[0].IDClient, 3, request.params.autoID,  request.body.vukup == undefined ? 0 : 1], function(err, next_result){
                    if(err) console.log(err);
                    connection.query("UPDATE autolizingdb.automobile SET Dostup = 0 WHERE (IDAutomobile = " + request.params.autoID + ");", function(err, ris){
                        connection.query("SELECT IDdogovir FROM autolizingdb.vmistdogovory ORDER BY IDdogovir DESC LIMIT 1", function(err, resdog){

                            connection.query("INSERT INTO autolizingdb.vmistdogovory(IDdogovir, Dateoplatu) VALUES(?, ?)", [resdog[0].IDdogovir + 1, request.body.start_data]);
                            response.redirect("../finish");
                        })

                    });
                });
            });
        };
    });
});

app.use('/public', express.static('public'));
app.use('/Sprites', express.static('Sprites'));


app.get("/", function(request, response){
    response.send("404");
});

app.listen(3000);