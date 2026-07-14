#include <QCoreApplication>
#include <QtCore/QDebug>
#include <QtCore/QtGlobal>

#include "config/AppConfig.hpp"
#include "HttpServer.hpp"

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    int port = 0;
    int pin433 = 0;
    int pin315 = 0;
    QString executablePath = "";
    QString apiKey = "";

    QStringList envVariables ;
    envVariables
        << "BACKEND_PORT"
        << "BACKEND_PIN_433"
        << "BACKEND_PIN_315"
        << "SEND_COMMAND_EXECUTABLE"
        << "BACKEND_APIKEY";

    for (int i=0; i<envVariables.count(); i++) {
      QByteArray ba = qgetenv(envVariables[i].toLocal8Bit());
      if (ba.isNull()) {
            qWarning() << envVariables[i] << " is not set. Aborting.";
            return 2;
        }
    }

    port = qgetenv("BACKEND_PORT").toInt();
    pin433 = qgetenv("BACKEND_PIN_433").toInt();
    pin315 = qgetenv("BACKEND_PIN_315").toInt();
    executablePath = QString(qgetenv("SEND_COMMAND_EXECUTABLE"));
    apiKey = QString(qgetenv("BACKEND_APIKEY"));

    AppConfig::setDefaultConfig(port, apiKey, executablePath, pin433, pin315);

    HttpServer server;

    return QCoreApplication::exec();
}
