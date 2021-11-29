# Notifyme - Spotify

Aplicación para notificar de nuevos lanzamientos en Spotify.

## Desplegar en Docker

> docker build -p 9500:5000 oscarinadev/notifyme-spotify

o para arquitectura arm

> docker build -p 9500:5000 oscarinadev/notifyme-spotify-arm

* Reemplazar el puerto 9500 con cualquier puerto en el que se quiera que la aplicación escuche

## Uso

Una vez desplegado entrar será necesario configurarla a través del cliente entrando en la url con el puerte que se indicara.

Será necesario

- Configurar un cron jon: es el intervalo en el que comprobará cuando hay releases en spotify
- Cuenta spotify: es necesario crear una aplicación de desarrollador e indicar los parametros para loguearse
- Alertzy: bajar esta aplicación para recivir notificaciones, hay que indicar la api key