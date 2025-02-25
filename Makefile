# .PHONY: major_release
# major_release:
# 	make build_all
# 	./package.sh -t major

# .PHONY: minor_release
# minor_release:
# 	make build_all
# 	./package.sh -t minor

# .PHONY: patch_release
# patch_release:
# 	make build_all
# 	./package.sh -t patch

.PHONY: build
build:
	wails build -clean

.PHONY: build_all
build_all:
	wails build -platform=windows/amd64,darwin/arm64,darwin/amd64 -ldflags '-s -w' -trimpath -clean

.PHONY: build_darwin_arm64
build_darwin_arm64:
	wails build -platform=darwin/arm64 -ldflags '-s -w' -trimpath

build_darwin_amd64:
	wails build -platform=darwin/amd64 -ldflags '-s -w' -trimpath

build_windows_amd64:
	wails build -platform=windows/amd64 -ldflags '-s -w' -trimpath
