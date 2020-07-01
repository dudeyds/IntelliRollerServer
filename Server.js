const WebSocket = require('ws');
const fs = require('fs');
const https = require('https');
var mysql = require('mysql');

var connecterror = "Hello"; 

const wss = new WebSocket.Server({ port: 8081, clientTracking: true});

var con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "password",
		database: "IntelliRoller"
	});

	con.connect(function(err) {
		connecterror = err;
	});



wss.getUniqueID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
};

wss.SetDisabilityMaster = function (Name, ID) {
	con.connect(function(err) {
		ws.send("Does this work?");
					var sql = "INSERT INTO Disability (Name) VALUES ( '" + message + "' )";
					con.query(sql, function (err, result) {
						if(err) 
						{
							
						}
						wss.SetDisabilityUser(Name, ID);
					});
				});
}
wss.SetDisabilityUser = function (Name, ID) {
	con.connect(function(err) { //add the disability to the user
				//if (err) throw err;
				var sql = "INSERT INTO DisabilityUser (`User-ID`, `Disability-ID`) VALUES ( '" + ID + "', '" + Name + "' )";
				con.query(sql, function (err, result) {
					//if (err) ws.send(err);
					if(err) 
					{
						
					}
					
				});
			});
}

function noop() {}

function heartbeat() {
  this.isAlive = true;
}
wss.on('connection', function connection(ws) {
	ws.ID = wss.getUniqueID();
	ws.isAlive = true;
	ws.on('pong', heartbeat);
	if(connecterror != "") {ws.send("Connection error: " + connecterror); }
	ws.email = null;
	ws.FirstName = null;
	ws.LastName = null;
	ws.Date_of_birth = null;
	ws.Disability = null;
	ws.Area_affected = null;
	ws.UserID = null;
	
	
	ws.on('message', function incoming(message) {
	if (message == "list") {
		wss.clients.forEach(function each(client) {
			ws.send('Client.ID: ' + client.ID);
		});
	} 
	else if (message == "help") {
		ws.send("list, generateKey, pair, messagePair, ListUser, SetUser, UserInfo, AddUser, AddDisability, AddAreaAffected, AddUserDisability, AddUserAreaAffected, RemoveDisability, RemoveUserDisability, RemoveAreaAffected, RemoveUserAreaAffected, EditUser")
	} 
	else if (message == "UserInfo") {
		ws.send(ws.FirstName + "*" + ws.LastName + "*" + ws.Date_of_birth + "*" + ws.email + "*" + ws.UserID + "*");
	} 
	else if (message.includes("SetUser ")) {
		var email = message.replace("SetUser ", "");
		con.connect(function(err) {
			ws.send("The function has run");
			con.query("SELECT * FROM User WHERE Email = '" + email + "'", function (err, result, fields) 
			{
				if(err) 
				{
					ws.send("Error!");
					ws.send(err.message);
				}
				try 
				{
					if(result[0].First_name != null)
					{
						ws.email = result[0].Email;
						ws.FirstName = result[0].First_name;
						ws.LastName = result[0].Last_name;
						ws.Date_of_birth = result[0].Date_of_birth;
						ws.UserID = result[0].ID;
						ws.Disability = null;
						ws.Area_affected = null;
						ws.send("PlayerInfo: " + result[0].First_name + "*" + result[0].Last_name + "*" + result[0].Date_of_birth + "*");
						
					}
					wss.clients.forEach(function each(client) 
					{
						if(ws.pairedID == client.ID) 
						{
							client.email = result[0].Email;
							client.FirstName = result[0].First_name;
							client.LastName = result[0].Last_name;
							client.Date_of_birth = result[0].Date_of_birth;
							client.UserID = result[0].ID;
							client.Disability = null;
							client.Area_affected = null;
							ws.send("Found pair");
							client.send("Found pair");
						}
					});
					
				}
				catch (error) 
				{
					ws.send("User not found");
				}
			});
		});
		ws.send(email);
	} 
	else if(message.includes("EditUser ")) {
		ws.send("EditUser started");
		if(ws.UserID === null) {
			ws.send("User not set");
		}
		else 
		{
			message = message.replace("EditUser ", "");
			var index = message.indexOf("*");
			var FirstName = message.substring(0,index);
			message = message.substring(index+1);
			var index = message.indexOf("*");
			var LastName = message.substring(0,index);
			message = message.substring(index+1);
			var index = message.indexOf("*");
			var DateOfBirth = message.substring(0,index);
			ws.send("Dateofbirth complete: " + DateOfBirth);
			message = message.substring(index+1);
			var index = message.indexOf("*");
			ws.send("nearly there " + index + " " + message);
			var Email = message.substring(0,index);
			ws.send("done!");
			ws.send(FirstName);
			ws.send(LastName);
			ws.send(DateOfBirth);
			ws.send(Email);
			con.connect(function(err) {
				//if (err) throw err;
				ws.send("Hello!");
				ws.send("Connected to sql!");
				var sql = "UPDATE User SET First_name = '" + FirstName + "', Last_name = '" + LastName + "', Date_of_birth = '" + DateOfBirth + "', Email = '" + Email + "' WHERE ID = '" + ws.UserID + "'";
				con.query(sql, function (err, result) {
					//if (err) ws.send(err);
					if(err) 
					{
						ws.send(err.message);
					}
					ws.send("Query sent!");
				});
			});
		}
	}
	else if(message == ("DeleteUser")) {
		ws.send("EditUser started");
		if(ws.UserID === null) {
			ws.send("User not set");
		}
		else 
		{
			con.connect(function(err) {
				//if (err) throw err;
				ws.send("Hello!");
				ws.send("Connected to sql!");
				var sql = "DELETE FROM User WHERE ID = '" + ws.UserID + "'";
				con.query(sql, function (err, result) {
					//if (err) ws.send(err);
					if(err) 
					{
						ws.send(err.message);
					}
					ws.send("User deleted");
					ws.UserID = null
				});
			});
		}
	}
	else if(message.includes("GetUserDisability")) {
		if(ws.UserID === null) {
			ws.send("User not set");
		}
		else 
		{
			ws.send("GetUserDisability");
			con.connect(function(err) {
				ws.send("The function has run");
				ws.send("this is the error: " + err);
				con.query("SELECT `Disability-ID` FROM DisabilityUser WHERE `USER-ID` = " + ws.UserID, function (err, result, fields) {
					if (err) throw err;
					ws.send("UserDisabilityListReset");
					for(i = 0;i<result.length;i++)
					{
						ws.send("Disability:" + result[i]['Disability-ID'] );
					}
				});
			});
		}
	}
	else if(message.includes("GetDisabilities")) {
		if(ws.UserID === null) {
			ws.send("User not set");
		}
		else 
		{
			ws.send("GetDisabilities");
			con.connect(function(err) {
				ws.send("The function has run");
				ws.send("this is the error: " + err);
				con.query("SELECT `Name` FROM Disability", function (err, result, fields) {
					if (err) throw err;
					ws.send("DisabilityListReset");
					for(i = 0;i<result.length;i++)
					{
						ws.send("DisabilityList:" + result[i]['Name'] );
					}
				});
			});
		}
	}
	else if(message.includes("GetAreas")) {
		if(ws.UserID === null) {
			ws.send("User not set");
		}
		else 
		{
			ws.send("GetAreas");
			con.connect(function(err) {
				ws.send("The function has run");
				ws.send("this is the error: " + err);
				con.query("SELECT `Name` FROM `Area-affected`", function (err, result, fields) {
					if (err) throw err;
					ws.send("AreaListReset");
					for(i = 0;i<result.length;i++)
					{
						ws.send("AreaList:" + result[i]['Name'] );
					}
				});
			});
		}
	}
	else if(message.includes("GetAreaAffected")) {
		
		ws.send("GetAreaAffected");
		con.connect(function(err) {
			ws.send("The function has run");
			ws.send("this is the error: " + err);
			con.query("SELECT `Area-affected-ID` FROM `Area-affectedUser` WHERE `USER-ID` = " + ws.UserID, function (err, result, fields) {
				if (err) throw err;
				ws.send("UserAreaListReset");
				for(i = 0;i<result.length;i++)
				{
					ws.send("Area:" + result[i]['Area-affected-ID']);
				}
			});
		});
	}
	else if(message.includes("AddUserDisability ")) {
		ws.send("AddUserDisability started");
		if(ws.UserID === null) {
			ws.send("User not set");
		}
		else 
		{
			message = message.replace("AddUserDisability ", "");
			ws.send("[" + message + "]");
			con.connect(function(err) {
				//if (err) throw err;
				ws.send("Hello!");
				ws.send("Connected to sql!");
				var sql = "INSERT INTO DisabilityUser (`User-ID`, `Disability-ID`) VALUES ( '" + ws.UserID + "', '" + message + "' )";
				con.query(sql, function (err, result) {
					//if (err) ws.send(err);
					if(err) 
					{
						ws.send(err.message);
					}
					ws.send("Query sent!");
				});
			});
		}
	}
	else if(message.includes("AddUserAreaAffected ")) {
		ws.send("AddUserAreaAffected started");
		if(ws.UserID === null) {
			ws.send("User not set");
		}
		else 
		{
			message = message.replace("AddUserAreaAffected ", "");
			ws.send("[" + message + "]");
			con.connect(function(err) {
				//if (err) throw err;
				ws.send("Hello!");
				ws.send("Connected to sql!");
				var sql = "INSERT INTO `Area-affectedUser` (`User-ID`, `Area-affected-ID`) VALUES ( '" + ws.UserID + "', '" + message + "' )";
				con.query(sql, function (err, result) {
					//if (err) ws.send(err);
					if(err) 
					{
						ws.send(err.message);
					}
					ws.send("Query sent!");
				});
			});
		}
	}
	else if(message.includes("AddTestEvent ")) {
		ws.send("AddTestEvent started");
		if(ws.UserID === null) {
			ws.send("User not set");
		}
		else 
		{
			message = message.replace("AddTestEvent ", "");
			var index = message.indexOf("*");
			var TestName = message.substring(0,index);
			message = message.substring(index+1);
			var index = message.indexOf("*");
			var DateTimeAttempted = message.substring(0,index);
			message = message.substring(index+1);
			//var index = message.indexOf("*");
			//var Result = message.substring(0,index);
			var Result = message;
			ws.send("Date/time: " + DateTimeAttempted);
			ws.send("done!");
			ws.send(TestName);
			ws.send(DateTimeAttempted);
			ws.send("Result: " + Result);
			ws.send("[" + message + "]");
			con.connect(function(err) {
				//if (err) throw err;
				ws.send("Hello!");
				ws.send("Connected to sql!");
				var sql = "INSERT INTO `Test-event` (`Test`, `User`, `Time_attempted`, `Result`) VALUES ( '" + TestName + "','" + ws.UserID + "','" + DateTimeAttempted + "','" + Result + "')";
				ws.send(sql);
				con.query(sql, function (error, results) {
					//if (err) ws.send(err);
					if(error) 
					{
						ws.send(error.message);
					}
					ws.send(results.message);
					ws.send("Query sent!");
					ws.send(results.insertId);
				});
			});
		}
	}
	else if(message.includes("AddTestEventMarker ")) { //Test eventID, then TestEventDescriptionID, then time
		ws.send("AddTestEvent started");
		if(ws.UserID === null) {
			ws.send("User not set");
		}
		else 
		{
			message = message.replace("AddTestEventMarker ", "");
			var index = message.indexOf("*");
			var TestEventID = message.substring(0,index);
			message = message.substring(index+1);
			var index = message.indexOf("*");
			var TestEventDescriptionID = message.substring(0,index);
			message = message.substring(index+1);
			var index = message.indexOf("*");
			var Time = message.substring(0,index);
			ws.send(TestEventID);
			ws.send(TestEventDescriptionID);
			ws.send(Time);
			con.connect(function(err) {
				//if (err) throw err;
				ws.send("Hello!");
				ws.send("Connected to sql!");
				var sql = "INSERT INTO `Test-event-marker` (`Test-event_ID`, `Test-event-description_ID`, `Time`) VALUES ( '" + TestEventID + "','" + TestEventDescriptionID + "','" + Time + "')";
				con.query(sql, function (error, results) {
					//if (err) ws.send(err);
					if(error) 
					{
						ws.send(error.message);
					}
					ws.send(results.message);
					ws.send("Query sent!");
				});
			});
		}
	}
	else if(message.includes("AddTestTimePoint ")) { //Test eventID, then TestEventDescriptionID, then time
		ws.send("AddTestTimePoint started");
		if(ws.UserID === null) {
			ws.send("User not set");
		}
		else 
		{
			message = message.replace("AddTestTimePoint ", "");
			var index = message.indexOf("*");
			var TestEventID = message.substring(0,index);
			message = message.substring(index+1);
			var index = message.indexOf("*");
			var Speed = message.substring(0,index);
			message = message.substring(index+1);
			var index = message.indexOf("*");
			var Time = message.substring(0,index);
			ws.send(TestEventID);
			ws.send(TestEventDescriptionID);
			ws.send(Time);
			con.connect(function(err) {
				//if (err) throw err;
				ws.send("Hello!");
				ws.send("Connected to sql!");
				var sql = "INSERT INTO `Test-Time-Point` (`Test`, `Speed`, `Time`) VALUES ( '" + TestEventID + "','" + Speed + "','" + Time + "')";
				con.query(sql, function (error, results) {
					//if (err) ws.send(err);
					if(error) 
					{
						ws.send(error.message);
					}
					ws.send(results.message);
					ws.send("Query sent!");
				});
			});
		}
	}
	else if (message == "ListUser") {
		ws.send("Entering ListUser");
		con.connect(function(err) {
			ws.send("The function has run");
			ws.send("this is the error: " + err);
			con.query("SELECT * FROM User", function (err, result, fields) {
				if (err) throw err;
				for(i = 0;i<result.length;i++)
				{
					ws.send("User ");
					ws.send(result[i].ID + ": Name: " + result[i].First_name + " " + result[i].Last_name);
				}
				ws.send("that's everyone");
			});
		});
	} 
	else if (message == "generateKey") {
		ws.key = Math.floor(Math.random() * (9999-1000) + 1000);
		ws.send(this.key);
	} 
	else if(message.includes("AddUser ")) {
		
		ws.send("Adduser started");
		message = message.replace("AddUser ", "");
		var index = message.indexOf("*");
		var FirstName = message.substring(0,index);
		message = message.substring(index+1);
		var index = message.indexOf("*");
		var LastName = message.substring(0,index);
		message = message.substring(index+1);
		var index = message.indexOf("*");
		var DateOfBirth = message.substring(0,index);
		ws.send("Dateofbirth complete: " + DateOfBirth);
		message = message.substring(index+1);
		var index = message.indexOf("*");
		ws.send("nearly there " + index + " " + message);
		var Email = message.substring(0,index);
		ws.send("done!");
		ws.send(FirstName);
		ws.send(LastName);
		ws.send(DateOfBirth);
		ws.send(Email);
		con.connect(function(err) {
			//if (err) throw err;
			ws.send("Hello!");
			ws.send("Connected to sql!");
			var sql = "INSERT INTO User (First_name, Last_name, Date_of_birth, Email) VALUES ( '"+ FirstName + "','" + LastName + "','" + DateOfBirth + "','" + Email + "' )";
			con.query(sql, function (err, result) {
				//if (err) ws.send(err);
				if(err) 
				{
					ws.send(err.message);
				}
				ws.send("Query sent!");
			});
		});
	} 
	else if(message.includes("AddDisability ")) {
		ws.send("AddDisability started");
		message = message.replace("AddDisability ", "");
		ws.send("[" + message + "]");
		con.connect(function(err) {
			//if (err) throw err;
			ws.send("Hello!");
			ws.send("Connected to sql!");
			var sql = "INSERT INTO Disability (Name) VALUES ( '" + message + "' )";
			con.query(sql, function (err, result) {
				//if (err) ws.send(err);
				if(err) 
				{
					ws.send(err.message);
				}
				ws.send("Query sent!");
			});
		});
		
	}
	
	else if(message.includes("RemoveDisability ")) {
		ws.send("RemoveDisability started");
		message = message.replace("RemoveDisability ", "");
		ws.send("[" + message + "]");
		con.connect(function(err) {
			//if (err) throw err;
			ws.send("Hello!");
			ws.send("Connected to sql!");
			var sql = "DELETE FROM Disability WHERE Name = '" + message + "'";
			con.query(sql, function (err, result) {
				//if (err) ws.send(err);
				if(err) 
				{
					ws.send(err.message);
				}
				ws.send("Query sent!");
			});
		});
		
	}
	else if(message.includes("RemoveUser ")) {
		ws.send("RemoveUser started");
		message = message.replace("RemoveUser ", "");
		ws.send("[" + message + "]");
		con.connect(function(err) {
			//if (err) throw err;
			ws.send("Hello!");
			ws.send("Connected to sql!");
			var sql = "DELETE FROM User WHERE Email = '" + message + "'";
			con.query(sql, function (err, result) {
				//if (err) ws.send(err);
				if(err) 
				{
					ws.send(err.message);
				}
				ws.send("Query sent!");
			});
		});
		
	}
	else if(message.includes("RemoveUserDisability ")) {
		if(ws.UserID === null) {
			ws.send("User not set");
		}
		else 
		{
			ws.send("RemoveUserDisability started");
			message = message.replace("RemoveUserDisability ", "");
			ws.send("[" + message + "]");
			con.connect(function(err) {
				//if (err) throw err;
				ws.send("Hello!");
				ws.send("Connected to sql!");
				var sql = "DELETE FROM DisabilityUser WHERE `Disability-ID` = '" + message + "' AND `User-ID` = '" + ws.UserID + "'";
				con.query(sql, function (err, result) {
					//if (err) ws.send(err);
					if(err) 
					{
						ws.send(err.message);
					}
					ws.send("Query sent!");
				});
			});
		}
		
	}
	else if(message.includes("AddAreaAffected ")) {
		ws.send("AddAreaAffected started");
		message = message.replace("AddAreaAffected ", "");
		ws.send(message);
		con.connect(function(err) {
			//if (err) throw err;
			ws.send("Hello!");
			ws.send("Connected to sql!");
			var sql = "INSERT INTO `Area-affected` (Name) VALUES ( '" + message + "' )";
			con.query(sql, function (err, result) {
				//if (err) ws.send(err);
				if(err) 
				{
					ws.send(err.message);
				}
				ws.send("Query sent!");
			});
		});
		
	}
	else if(message.includes("RemoveAreaAffected ")) {
		ws.send("RemoveAreaAffected started");
		message = message.replace("RemoveAreaAffected ", "");
		ws.send("[" + message + "]");
		con.connect(function(err) {
			//if (err) throw err;
			ws.send("Hello!");
			ws.send("Connected to sql!");
			var sql = "DELETE FROM `Area-affected` WHERE Name = '" + message + "'";
			
			con.query(sql, function (err, result) {
				//if (err) ws.send(err);
				if(err) 
				{
					ws.send(err.message);
				}
				ws.send("Query sent!");
			});
		});
		
	}
	else if(message.includes("RemoveUserAreaAffected ")) {
		ws.send("RemoveUserAreaAffected started");
		message = message.replace("RemoveUserAreaAffected ", "");
		ws.send("[" + message + "]");
		con.connect(function(err) {
			//if (err) throw err;
			ws.send("Hello!");
			ws.send("Connected to sql!");
			var sql = "DELETE FROM `Area-affectedUser` WHERE `Area-affected-ID` = '" + message + "' AND `User-ID` = '" + ws.UserID + "'";
			con.query(sql, function (err, result) {
				//if (err) ws.send(err);
				if(err) 
				{
					ws.send(err.message);
				}
				ws.send("Query sent!");
			});
		});
		
	}
	else if(message.includes("pair ")) {
		message = message.replace("pair ", "");
		wss.clients.forEach(function each(client) 
		{
			if(client.key == message) 
			{
				ws.pairedID = client.ID
				client.pairedID = ws.ID
				ws.send("Matched");
				client.send("Matched");
				
			}
  		});
		if (!ws.pairedID)
		{
			ws.send("No Matching key");
		}

	} 
	else if (message.includes("messagePair ")) {
		var found = false;
		wss.clients.forEach(function each(client) {
        		if(client.ID == ws.pairedID) {
				client.send(message.replace("messagePair ", ""));
				found = true;
				ws.send("Ok");
			}
  		});
		if(found == false) {
			ws.send("Error");
		}
	} 
	else {
	console.log('received: %s', message);
    	ws.send('Unknown command: ' + message);
	}
	
	
    
  });
		ws.on('close', function() {
			if(ws.pairedID)
			{
				wss.clients.forEach(function each(client) {
					if(client.ID == ws.pairedID) {
						client.send("Disconnected from pair");
					}
				});
			}
		});
});
const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);
