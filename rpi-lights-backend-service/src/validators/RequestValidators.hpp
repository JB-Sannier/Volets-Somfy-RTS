#ifndef REQUESTVALIDATORS_HPP
#define REQUESTVALIDATORS_HPP

#include "../requests/SendCommandRequest.hpp"
#include <QtHttpServer/QHttpServerRequest>

class RequestValidators
{
public:
    static SendCommandRequest buildSendRequest(const QHttpServerRequest&, bool*); // request, ok
};

#endif // REQUESTVALIDATORS_HPP
