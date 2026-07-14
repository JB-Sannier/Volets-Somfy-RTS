cmake_minimum_required(VERSION 3.19)
project(RpiBackend VERSION 1.0.0 LANGUAGES CXX)

find_package(Qt6 REQUIRED COMPONENTS Core HttpServer)

qt_standard_project_setup()

qt_add_executable(RpiBackend
    src/main.cpp
    src/HttpServer.hpp src/HttpServer.cpp
    src/controllers/LightsController.hpp src/controllers/LightsController.cpp
    src/controllers/AuthorizationMiddleware.hpp src/controllers/AuthorizationMiddleware.cpp
    src/config/AppConfig.hpp src/config/AppConfig.cpp
    src/validators/RequestValidators.hpp src/validators/RequestValidators.cpp
    src/requests/SendCommandRequest.cpp
    src/services/SendCommandService.hpp src/services/SendCommandService.cpp
)

target_link_libraries(RpiBackend
    PRIVATE
        Qt::Core
        Qt::HttpServer
)

install(TARGETS RpiBackend
    BUNDLE  DESTINATION .
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
)
