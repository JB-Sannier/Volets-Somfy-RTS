#include "HttpServer.hpp"
#include "controllers/LightsController.hpp"
#include "config/AppConfig.hpp"
#include <QtCore/QDebug>

HttpServer::HttpServer(QObject *parent)
    : QObject(parent)
{
    tcpServer = new QTcpServer(this);
    httpServer = new QHttpServer(this);
    tcpServer->listen(QHostAddress::Any, AppConfig::getDefaultConfig()->port());
    httpServer->bind(tcpServer);

    httpServer->route(
        "/lights/sendCommand",
        QHttpServerRequest::Method::Post,
        [](const QHttpServerRequest& request, QHttpServerResponder& responder ) {
            LightsController::sendCommand(request, responder) ;
        }
    );

}
