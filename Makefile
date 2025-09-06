clean:
	$(MAKE) -C authentication-service clean
	$(MAKE) -C somfy-shutters-service clean
	$(MAKE) -C backend-service clean
	$(MAKE) -C frontend clean
	$(MAKE) -C mobile-frontend-service clean
	$(MAKE) -C swagger-ui-service clean

distclean:
	$(MAKE) -C authentication-service distclean
	$(MAKE) -C somfy-shutters-service distclean
	$(MAKE) -C backend-service distclean
	$(MAKE) -C frontend clean
	$(MAKE) -C mobile-frontend-service clean
	$(MAKE) -C swagger-ui-service clean


build-lan:
	$(MAKE) -C authentication-service build
	$(MAKE) -C somfy-shutters-service build
	$(MAKE) -C backend-service build
	$(MAKE) -C frontend build-lan
	$(MAKE) -C mobile-frontend-service build-lan
	$(MAKE) -C swagger-ui-service build

build-wan:
	$(MAKE) -C authentication-service build
	$(MAKE) -C somfy-shutters-service build
	$(MAKE) -C backend-service build
	$(MAKE) -C frontend build-wan
	$(MAKE) -C mobile-frontend-service build-wan
	$(MAKE) -C swagger-ui-service build

build-lan-and-wan:
	$(MAKE) -C authentication-service build
	$(MAKE) -C somfy-shutters-service build
	$(MAKE) -C backend-service build
	$(MAKE) -C frontend build-lan-and-wan
	$(MAKE) -C mobile-frontend-service build-lan-and-wan
	$(MAKE) -C swagger-ui-service build

build: build-lan-and-wan
