clean:
	rm -rf build node_modules

distclean: clean
	rm -rf bundle

build:
	npm i && npm run build && npm run bundle && npm run format && npm run lint

