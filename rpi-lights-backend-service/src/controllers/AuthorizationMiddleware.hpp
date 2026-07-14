#ifndef AUTHORIZATIONMIDDLEWARE_HPP
#define AUTHORIZATIONMIDDLEWARE_HPP

#include <QtHttpServer/QHttpServerRequest>
#include <QtHttpServer/QHttpServerResponder>

class AuthorizationMiddleware {
public:
    AuthorizationMiddleware();

    static bool validateAuthorization(const QHttpServerRequest& request, QHttpServerResponder& responder);

private:
    static void sendUnauthorized(QHttpServerResponder responder);
};

#endif // AUTHORIZATIONMIDDLEWARE_HPP
