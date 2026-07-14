#include "AuthorizationMiddleware.hpp"
#include <QtHttpServer/QHttpServerResponse>
#include <QtCore/QJsonObject>
#include <QtCore/QString>
#include "../config/AppConfig.hpp"

AuthorizationMiddleware::AuthorizationMiddleware()
{
}

bool AuthorizationMiddleware::validateAuthorization(const QHttpServerRequest& request, QHttpServerResponder& responder)
{
    const QString BEARER_WORD = "Bearer ";

    QString authorization = request.value("x-api-key");
    if (authorization.isNull() || authorization.isEmpty()) {
        AuthorizationMiddleware::sendUnauthorized(std::move(responder));
        return false;
    }
    if (authorization.startsWith(BEARER_WORD)) {
        authorization = authorization.replace(BEARER_WORD, "");
    }

    AppConfig* appConfig = AppConfig::getDefaultConfig();
    if (authorization!=appConfig->apiKey()) {
        AuthorizationMiddleware::sendUnauthorized(std::move(responder));
        return false;
    }
    return true;
}

void AuthorizationMiddleware::sendUnauthorized(QHttpServerResponder responder)
{
    QJsonObject object;
    object.insert("errorCode", "Unauthorized");
    responder.sendResponse(QHttpServerResponse(object, QHttpServerResponder::StatusCode::Unauthorized));
}
