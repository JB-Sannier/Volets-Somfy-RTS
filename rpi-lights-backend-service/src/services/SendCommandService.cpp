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
    arguments << QString::number(appConfig->pin());
    arguments << QString::number(scr.code);
    arguments << QString::number(scr.protocol);
    arguments << QString::number(scr.pulseDelay);

    qDebug() << "About to launch executable : " << appConfig->executableName();
    qDebug() << "Parameters : " << arguments.join("  ");
    process.execute(appConfig->executableName(), arguments);
}