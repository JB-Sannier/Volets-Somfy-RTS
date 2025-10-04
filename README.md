# Somfy RTS Shutters

Current status : **Still in DEV, not usable on Production yet.**

## Background

Based on [Nickduino's Pi-Somfy project](https://github.com/Nickduino/Pi-Somfy), this application will provide another webapp, with (rather simple) users management, and shutters management. For educational purposes, this webapp is splitted into micro-services, trying to respect the SOLID principles.

While I used [Tostcorp Box](https://www.tostcorp.com/accueil)'s solution for some years, this solution brought also some drawbacks:

- After putting a program on crontab on my server, I noticed that, when the internet connection fails, the TostCorp Box's solution cannot reconnect automatically to the MQTT server, meaning you have to reboot the box.

- Also, I'm depending of a remote server that could be shut down anytime, and I don't have any control on this

- If you prefer a lower budget solution, and you're not afraid of handling a soldering iron, Nickduino's solution is the perfect match.

Although I don't use all functionalities of Nickduino's project, I still use some API calls from my webapp.

Initial context : I protect Pi-Somfy project with a password, by adding Password=**Something** into the operateShutter.conf file. The security purposes, I prefer not to allow everyone to play with my shutters.

But, by doing so, I cannot use Nickduino's webapp anymore.

Additional context : I wanted to do some demos to my children about micro-services.

Also, I'm hosting my own server, different from the RPi3.

## So, what about Pi-Somfy ?

This project doesn't aim to replace Nickduino's work. If you need a webapp to control your shutters, I would advise you to use his project. It works, really.

But if you prefer to add some security, users management, **and** you're not using the entire functionalities of Pi-Somfy, **and** you are hosting your own server, then this project may be for you.

You can also host all these micro-services on your own Raspberry Pi. I just wish you good luck when starting each micro-service, loading a wide amount of files into the node_modules directory, using a simple SD Card of your RaspBerry Pi.

## Technical solutions

As I'm more used to Typescript, PostgreSQL, Node.js and React, I started each micro-service by using Typescript, inversify and IoC concepts; for the frontend, I made an example using Material UI, as I tried to port the frontend to an Android application (work in progress).

**Somfy-shutters-service** : Will provide some means to call Nickduino's project on my RPi3, using the previously set Password. The Node.js webapp will be listening on localhost, and should not be exposed on Internet (typically, listening on 127.0.0.1 in my case)

**Authentication-service**: Will provide users management (adding a new user, setting the roles for this user, verifying the JWT tokens). As for somfy-shutters-service, it'll be listening on LAN only, and should be exposed to Internet.

**Backend-service**: This is the only exposed application. You can decide to expose it on Internet, or only on your LAN; your choice.

**Frontend-service**: This is one webapp that will allow you to use your web browser to handle your users and shutters.

**Mobile-frontend-service**: This one is the porting project, to transform the webapp into an application.

## Initial deployment

**Make sure Nickduino's Pi-Somfy is working in your home. If your shutters cannot be used by his application, it's no use to install and deploy this application. Seriously.**

I'm supposing that you will also use a different server than your RPi3. But, if not, feel free to adapt some lines...

Also, on the computer you want to run this project on, make sure you have the **npm** and **node** commands installed.

### Nickduino's project

In the operateShutters.conf file, add the following line:

`Password=<SOME_PASSWORD_YOU_CAN_DEFINE_BY_YOURSELF>`

Note the password you filled there, it'll be mandatory for somfy-shutters-service

### PostgreSQL server

Make sure PostgreSQL can run on your 127.0.0.1 ip address (no need to expose it on Internet).

Then, create an user, password and database for this project. Inside of the DB, create also two schemas (for example : dev_shutters, dev_users). Each micro-service will need his own schema.

### Somfy-shutters-service

Using the command-line, go into **somfy-shutters-service** directory.
Copy the .env.example file into .env file.

Adapt the values to your environment :

**HOST**, **PORT** : Used for the server to listen on HTTP requests. Reminder : they should not be exposed to Internet...

**SOMFY_SERVER_HOST_NAME**: The Raspberry Pi's IP address (or LAN name) where Nickduino's project is hosted.

**SOMFY_SERVER_PORT**: Same for the listening port

**SOMFY_SERVER_PASSWORD**: The password you set on Nickduino's project, in the operateShutters.conf.

**DB_HOSTNAME**, **DB_PORT**, **DB_USER**, **DB_PASSWORD**, **DB_NAME**, **DB_SCHEMA**: Coordinates of the Postgresql hostname, port, the user/password used to connect to the DB, the DB name itself, and the schema you have previously created for this micro-service.

**SELF_API_KEY**: This key will be shared with the backend-service, to secure calls between the two micro-services.

Then, run the following commands :

```
    npm run install # To install all the node_modules
    npm run build # To build the project
    npm run start # To launch the project on debugging purposes
```

### authentication-service

Using the command-line, go into the **authentication-service** directory.

Copy the .env.example file to .env file.

Adapt the values to your environment:

**HOST**, **POST** : Local IP address and port you want this micro-service to listen.

**DB_HOSTNAME**, **DB_PORT**, **DB_USER**, **DB_PASSWORD**, **DB_NAME**, **DB_SCHEMA**: Coordinates of the Postgresql hostname, port, the user/password used to connect to the DB, the DB name itself, and the schema you have previously created for this micro-service.

**REFRESH_TOKEN_SIGNING_KEY**: A security key, of you choice, that will be the signing key for the Refresh Token operations. Make it as long as you like. (for example, there, I created three uuids, concatenated them, remplaced every "-" into "!\_\*" characters...)

Then, run the following commands :

```
    npm run install # To install all the node_modules
    npm run build # To build the project
    npm run start # To launch the project on debugging purposes
```

As long as you didn't create an user with "Users Manager" role, this service will use a temporary user (admin@localhost), with a random password. Use this temporary credential to register you username, later, using the frontend.

### backend-service

Using the command-line, go into the **backend-service** directory.

Copy the **.env.example** file to **.env** file.

Adapt the values to your environment:

**ENV**: Not used for now. You can set it to **dev**, or **prod**, or whatever.

**HOST**, **PORT** : The IP address and port number your application will work. Remember, if you want your application to be reachable on the LAN, you should **not** use 127.0.0.1 / ::1 as listening interface !

**AUTHENTICATION_SERVICE_URL**: The URL pointing to the previously set HOST,PORT of the authentication service. For example, if you set 127.0.0.1 as HOST, and 3001 as port number, this line will be :

```
AUTHENTICATION_SERVICE_URL=http://127.0.0.1:3001
```

**SOMFY_SHUTTERS_SERVICE_URL**: The URL pointing to the previously set HOST,PORT of the somfy-shutters-service. Same syntax as for AUTHENTICATION_SERVICE_URL line.

**SOMFY_SHUTTERS_SERVICE_API_KEY**: The value you previously set for SELF_API_KEY in the somfy-shutters-service.

Then, as for the somfy-shutters-service and the authentication-service, run the following :

```
    npm run install # To install all the node_modules
    npm run build # To build the project
    npm run start # To launch the project on debugging purposes
```

## frontend-service

If you want a WAN build : Go into the frontend-service, duplicate the **vite.config.wan-values.example** into **vite.config.wan-values.ts** and adapt the values.

If you want a LAN build : Go into the frontend-service, duplicate the **vite.config.lan-values.example** into **vite.config.lan-values.ts** and adapt the values.

**host**: The host where your frontend-service should be reachable

**port**: The post number where your frontend-service should be reachable

**allowed-hosts**: Change the array to include your backend-service

**Adapt lines 4 to 7**: change the JSON.stringify value to your backend **HOST:PORT** coordinates.

You can open your web browser to test the frontend, fill your first username and program your shutters.

### swagger-ui-service

This service will create a standalone frontend for displaying the API calls to the backend service. You can npm run install && npm run start to see the API Call. In order to test it, don't forget to change the line 12 of the following line :

```
swagger-ui-service/public/swagger.yml
```

... pointing to the URL of your backend-service.

## About i18n...

The frontend should be able to display itself using french or english (being the fallback) languages, based on your web browser settings.

For other languages, I only speak French and English, so... feel free to propose some translations.

## Local install

### Authentication Service, Somfy Shutters Service, Backend:

There is a Webpack build available, that you can use for every of the 3 backends.

I also prepared some scripts that you can adapt, to install every micro-service on your server.

For example, let's take authentication-service. After running the following commands :

```
    npm run build
    npm run bundle
```

... you should have two directories: bundle and build. The build directory is the transpiled project into NodeJS. If you use this build, just change somfyrts-authentication.service, on line 8, and adapt only the build directory.
But if you want to use the bundle directoy, change the following line :

```
ExecStart=node <PATH_TO_YOUR_AUTHENTICATION_SERVICE_BUNDLE_DIR>/authentication-service.js
```

You can do this to the three micro-services.

Copy the service files into your OS systemd services directory. On Debian Trixie, I copied these to the following directory :

```
    /etc/systemd/system/
```

You can start the three services :

```
systemctl start somfyrts-authentication
systemctl start somfyrts-shutters
systemctl start somfyrts-backend
```

To enable these three services at startup :

```
systemctl enable somfyrts-authentication
systemctl enable somfyrts-shutters
systemctl enable somfyrts-backend
```

### Frontend:

For this part, I can't help that much. I can only provide you some config files for Apache2 (see general-assets directory). You can use the shutters\*.conf files and place them in /etc/apache2/sites-available .
Adapt the directory where you will put the build directory from the frontend. Copy also the ".htaccess" file in the general-assets/apache2 directory, to the frontend build directory. In my example, the frontend build was copied to /var/www/html/shutters directory.

Then as root, use the following command :

```
a2enmod shutters
a2enmod shutters-le-ssl
```

Don't forget to adapt the conf files to point to your local backend URL.

## Mobile applications

In order to build Android applications, you will need Android Studio and the ANDROID_HOME environment variable set.
See the [Capacitor Install Documentation](https://capacitorjs.com/docs/getting-started/environment-setup).

Once this is done, you will need to build the frontent variants (WAN, LAN), that you want to produce.

In the frontend-service directory :

### For the LAN build

```
npm install && npm run build:lan
```

### For the WAN build

```
npm install && npm run build:wan
```

Then, go to the mobile-frontend-service.
If you want a LAN build, you will need to adapt the following file :
mobile-frontend-service/android/app/src/main/res/xml/network_security_config.xml

Adapt the IP address to the backend server's IP address

```
        <domain includeSubdomains="true">192.168.3.5</domain>
```

Then, in the mobile-frontend-service, run :

```
npm install && npm run build:lan
```

### For the WAN build

```
npm install && npm run build:wan
```

The APK packages will be located in these directories:
mobile-frontend-service/android/app/build/outputs/apk/lan/release/app-lan-release.apk
mobile-frontend-service/android/app/build/outputs/apk/wan/reelease/app-wan-release.apk

## Simplified build tool :

From the Volets-Somfy-RTS directory, you can use the following commands:

### LAN only build:

```
    make build-lan
```

### WAN only build:

```
    make build-wan
```

### Both builds:

```
    make build-lan-and-wan
```

## TODO

- Write some Dockerfile for each micro-service, as well as a Dockerfile for the DB container; assemble all of these into a docker.compose.yml file.

- Add some functionalities to the shutters operation, to provide more than raise/lower/stop/program commands.

## Additional Infos

[This diagram](./Shutters%20Project%20Organisation.svg) should contain a general organization about this project.
