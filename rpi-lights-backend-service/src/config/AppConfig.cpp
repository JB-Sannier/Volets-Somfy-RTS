#include "AppConfig.hpp"
#include <QtCore/QtDebug>

AppConfig* AppConfig::_defaultConfig = 0;

AppConfig::AppConfig(
    unsigned short int paramPort,
    const QString& paramApiKey,
    const QString& paramExecutableName,
    unsigned short int paramPin) :
    _port(paramPort),
    _apiKey(paramApiKey),
    _executableName(paramExecutableName),
    _pin(paramPin)
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
    unsigned short int paramPin
    )
{
    if (!_defaultConfig) {
        _defaultConfig = new AppConfig(paramPort, paramApiKey, paramExecutableName, paramPin);
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

unsigned short int AppConfig::pin() const {
    return _pin;
}