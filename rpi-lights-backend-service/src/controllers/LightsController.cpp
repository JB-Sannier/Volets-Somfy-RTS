#include "LightsController.hpp"
#include <QtNetwork/QHttpHeaders>
#include <QtHttpServer/QHttpServerResponse>
#include <QtCore/QJsonObject>
#include "AuthorizationMiddleware.hpp"
#include <QtCore/QProcess>
#include "../requests/SendCommandRequest.hpp"
#include "../validators/RequestValidators.hpp"
#include <QtCore/QString>
#include "../services/SendCommandService.hpp"

LightsController::LightsController(QObject *parent)
    : QObject{parent}
{
}

void LightsController::sendCommand(const QHttpServerRequest& request, QHttpServerResponder& responder)
{
    if (!AuthorizationMiddleware::validateAuthorization(request, responder)) {
        return;
    }
    bool ok = true;
    SendCommandRequest scr = RequestValidators::buildSendRequest(request, &ok);
    if (!ok) {
        QJsonObject obj;
        obj.insert("errorCode", "Malformated Request");

        responder.sendResponse(QHttpServerResponse(obj, QHttpServerResponse::StatusCode::BadRequest));
        return;
    }

    SendCommandService().sendCommand(scr);

    QHttpHeaders responseHeaders;
    responseHeaders.insert(0, QHttpHeaders::WellKnownHeader::AccessControlAllowOrigin, "*");
    responseHeaders.insert(1, QHttpHeaders::WellKnownHeader::ContentType, "application/json");
    
    QJsonObject obj ;
    obj.insert("status", "ok");

    QHttpServerResponse response(obj, QHttpServerResponse::StatusCode::Accepted);
    response.setHeaders(responseHeaders);
    
    responder.sendResponse(response);

}
