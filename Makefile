
SRC = $(shell find lib/*.js)
OUT = $(SRC:.js=.out)

all: build/texty.js build/texty.min.js
	du build/*

build/texty.js: $(OUT)
	@mkdir -p build
	cat $^ > $@

%.out: %.js
	cat head $< tail > $@ 

build/texty.min.js: build/texty.js
	uglifyjs --no-mangle $< > $@

clean:
	rm -fr build $(OUT)

.PHONY: clean