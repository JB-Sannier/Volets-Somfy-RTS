#ifndef APPCONFIG_HPP
#define APPCONFIG_HPP

#include <QtCore/QString>

class AppConfig {

public:
    static AppConfig* getDefaultConfig();
    static void setDefaultConfig(unsigned short int,const QString&, const QString&, unsigned short int); // port, apiKey, executableName, pin
    unsigned short int port() const;
    const QString& apiKey() const;
    const QString& executableName() const;
    unsigned short int pin() const;

private:
    AppConfig(unsigned short int, const QString&, const QString&, unsigned short int); // port, apiKey, executableName, pin

    static AppConfig* _defaultConfig;
    unsigned short int _pin;
    unsigned short int _port;
    const QString& _apiKey;
    const QString& _executableName;

};

#endif // APPCONFIG_HPP
