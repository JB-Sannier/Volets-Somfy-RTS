#ifndef SENDCOMMANDSERVICE_HPP
#define SENDCOMMANDSERVICE_HPP

#include "../requests/SendCommandRequest.hpp"

class SendCommandService
{
public:
    SendCommandService();
    void sendCommand(const SendCommandRequest&);
};

#endif // SENDCOMMANDSERVICE_HPP
