cnpm install
cd node_modules
cd serialport

node-gyp rebuild --target=1.7.11 --arch=x64 --dist-url=https://atom.io/download/electron
cd ..
cd ..
yarn dist --platform=win --arch=ia32