#ifndef LIGHTSCONTROLLER_HPP
#define LIGHTSCONTROLLER_HPP

#include <QObject>
#include <QtHttpServer/QHttpServerRequest>
#include <QtHttpServer/QHttpServerResponder>

class LightsController : public QObject
{
    Q_OBJECT
public:
    explicit LightsController(QObject *parent = nullptr);

    static void sendCommand(const QHttpServerRequest& request, QHttpServerResponder& responder);

};

#endif // LIGHTSCONTROLLER_HPP
