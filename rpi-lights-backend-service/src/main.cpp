#include <QCoreApplication>
#include <QtCore/QDebug>
#include <QtCore/QtGlobal>

#include "config/AppConfig.hpp"
#include "HttpServer.hpp"

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    int port = 0;
    int pin = 0;
    QString executablePath = "";
    QString apiKey = "";

    QStringList envVariables ;
    envVariables
        << "BACKEND_PORT"
        << "BACKEND_PIN"
        << "SEND_COMMAND_433_EXECUTABLE"
        << "BACKEND_APIKEY";

    for (int i=0; i<envVariables.count(); i++) {
      QByteArray ba = qgetenv(envVariables[i].toLocal8Bit());
      if (ba.isNull()) {
            qWarning() << envVariables[i] << " is not set. Aborting.";
            return 2;
        }
    }

    port = qgetenv("BACKEND_PORT").toInt();
    pin = qgetenv("BACKEND_PIN").toInt();
    executablePath = QString(qgetenv("BACKEND_EXECUTABLE"));
    apiKey = QString(qgetenv("BACKEND_APIKEY"));

    AppConfig::setDefaultConfig(port, apiKey, executablePath, pin);

    HttpServer server;

    return QCoreApplication::exec();
}
