#include "SendCommandService.hpp"
#include "../config/AppConfig.hpp"
#include <QtCore/QStringList>
#include <QtCore/QProcess>
#include <QDebug>

SendCommandService::SendCommandService()
{
}

void SendCommandService::sendCommand(const SendCommandRequest& scr)
{
    AppConfig* appConfig = AppConfig::getDefaultConfig();
    QProcess process;
    QStringList arguments;
    int pinNumber = scr.frequency == 315 ? appConfig->pin315() : appConfig->pin433();
    arguments << QString::number(pinNumber);
    arguments << QString::number(scr.code);
    arguments << QString::number(scr.protocol);
    arguments << QString::number(scr.pulseDelay);

    qDebug() << "About to launch executable : " << appConfig->executableName();
    qDebug() << "Parameters : " << arguments.join("  ");
    process.execute(appConfig->executableName(), arguments);
}