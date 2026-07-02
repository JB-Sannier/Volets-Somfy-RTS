#include "RequestValidators.hpp"
#include <QtCore/QJsonDocument>
#include <QtCore/QJsonObject>

SendCommandRequest RequestValidators::buildSendRequest(const QHttpServerRequest& request, bool *ok)
{
    SendCommandRequest returnedRequest = {
        .code =  0,
        .protocol =  0,
        .pulseDelay =  0,
        .frequency = 0,
    };

    QJsonDocument doc = QJsonDocument::fromJson(request.body());
    if (!doc.isObject()) {
        *ok = false;
        return returnedRequest;
    }

    QJsonObject object = doc.object();
    if (!object.contains("code") || !object.contains("protocol") || !object.contains("pulseDelay") || !object.contains("frequency")) {
        *ok = false;
        return returnedRequest;
    }

    int frequency = object.value("frequency").toInt(); 
    if (frequency != 315 && frequency != 433) {
        *ok = false;
        return returnedRequest;
    }

    returnedRequest = {
        .code = object.value("code").toInt(),
        .protocol = object.value("protocol").toInt(),
        .pulseDelay = object.value("pulseDelay").toInt(),
        .frequency = object.value("frequency").toInt(),
    };
    *ok = true;
    return returnedRequest;
}
