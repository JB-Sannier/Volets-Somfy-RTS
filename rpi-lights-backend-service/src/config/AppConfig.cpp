#include "AppConfig.hpp"
#include <QtCore/QtDebug>

AppConfig* AppConfig::_defaultConfig = 0;

AppConfig::AppConfig(
    unsigned short int paramPort,
    const QString& paramApiKey,
    const QString& paramExecutableName,
    unsigned short int paramPin433,
    unsigned short int paramPin315) :
    _port(paramPort),
    _apiKey(paramApiKey),
    _executableName(paramExecutableName),
    _pin433(paramPin433),
    _pin315(paramPin315)
{
}

AppConfig* AppConfig::getDefaultConfig()
{
    return _defaultConfig;
}

void AppConfig::setDefaultConfig(
    unsigned short int paramPort,
    const QString& paramApiKey,
    const QString& paramExecutableName,
    unsigned short int paramPin433,
    unsigned short int paramPin315
    )
{
    if (!_defaultConfig) {
        _defaultConfig = new AppConfig(paramPort, paramApiKey, paramExecutableName, paramPin433, paramPin315);
    } else {
        qDebug() << "Error: AppConfig already defined...";
    }
}

unsigned short int AppConfig::port() const
{
    return _port;
}

const QString& AppConfig::apiKey() const
{
    return _apiKey;
}

const QString& AppConfig::executableName() const {
    return _executableName;
}

unsigned short int AppConfig::pin433() const {
    return _pin433;
}

unsigned short int AppConfig::pin315() const {
    return _pin315;
}
