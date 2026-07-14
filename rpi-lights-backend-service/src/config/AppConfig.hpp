#ifndef APPCONFIG_HPP
#define APPCONFIG_HPP

#include <QtCore/QString>

class AppConfig {

public:
    static AppConfig* getDefaultConfig();
    static void setDefaultConfig(unsigned short int,const QString&, const QString&, unsigned short int, unsigned short int); // port, apiKey, executableName, pin433, pin315
    unsigned short int port() const;
    const QString& apiKey() const;
    const QString& executableName() const;
    unsigned short int pin433() const;
    unsigned short int pin315() const;

private:
    AppConfig(unsigned short int, const QString&, const QString&, unsigned short int, unsigned short int); // port, apiKey, executableName, pin433, pin315

    static AppConfig* _defaultConfig;
    unsigned short int _pin433;
    unsigned short int _pin315;
    unsigned short int _port;
    QString _apiKey;
    QString _executableName;
};

#endif // APPCONFIG_HPP
