all: clean
	elm make src/Main.elm --output main.js
	mkdir build
	cp -f main.js build/main.js
	cp -f public/index.html .
	
dev:
	cp -rf assets/ build
	cp -f public/index.html .
	elm make src/Main.elm --output build/main.js
clean:
	rm -rf build/

changelog:
	git log --all > gitlog.txt
	python3 test.py