# IntelliRollerServer
A NodeJS server for the IntelliRoller project

This server is currently being ran on an ubunutu server VM. A mySQL database is being accessed on the same device.

Due to it's asynchronous nature it can allow potentially hundreds of of clients to use the service at once efficiently.


The application is run using PM2 so the server can perform other functions while running the application in the background.

Obviously this program requires firewall rules being setup etc.
