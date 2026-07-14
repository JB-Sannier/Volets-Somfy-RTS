#ifndef HTTPSERVER_HPP
#define HTTPSERVER_HPP

#include <QObject>
#include <QtHttpServer/QHttpServer>
#include <QtNetwork/QTcpServer>

class HttpServer : public QObject
{
    Q_OBJECT
public:
    explicit HttpServer(QObject *parent = nullptr);

private:
    QTcpServer* tcpServer;
    QHttpServer* httpServer;
};

#endif // HTTPSERVER_HPP
