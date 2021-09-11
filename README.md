# zil-heartbeat-nft
Generator for Zilliqa NFT containing heartbeat obtained by an ECG machine.

![nft](/doc-img/nft.jpg?raw=true "Zilliqa Heartbeat NFT")

This project consists of a hardware and software part. The hardware part is
a simple electrocardiography (https://en.wikipedia.org/wiki/Electrocardiography) machine which reads ECG signal from a person.

The software application reads the signal using an USB port and mints
a perfectly unique NFT containing a few heartbeats of the person. The
user of the machine can create an exclusive token of their life to
share with friends or loved ones. Or a celebrity can mint NFTs to
sell for a charity.

The following image contains the schematics for the hardware part. 

![schematics](/doc-img/schematics.jpg?raw=true "Device Schematics")

The device is based on the Analog Devices AD8232 chip on a small board
https://www.sparkfun.com/products/12650?_ga=2.53472808.1426367473.1623172162-865111033.1622002857
. The AD8232 chip serves as an amplifier of the ECG signal which is
converted to digital value by the Arduino UNO microcomputer.

![hw](/doc-img/hw.jpg?raw=true "ECG Device")

The firmware for the arduino computer can be found in the `arduino` directory of the github project.

The application is a javascript project using current version of
node.js. It must be hosted locally because a connection to the 
USB port is needed.

Before running the apllication the NFT you must:

1. deploy the NFT contract on
Zilliqa (see the `zrc` directory)

2. create an account on https://nft.storage/ service

3. edit the `secrets.js` file (use `secrets.js.example` as a
template). It is necessary to fill-in the account name, the private
key and an apiKey for the https://nft.storage/ storage service.


The application can be launched in an usuall way

```
npm start
```

Then the UI can be accessed from a browser on http:localhost:3000 . The application displays an input form. 

![form](/doc-img/form.png?raw=true "Input form screenshot")

The user must fill-in its name, upload a portrait photo and define the USB port. It is also possible to test the app without hardware in simulator mode

When submitted, the application starts to read data from the ECG device. 

![reading](/doc-img/reading.png?raw=true "ECG reading screenshot")

After enough (640) samples get collected, the NFT image is composed and
shown to the user. If the user decides to mint the NFT from it, the image is uploaded
to nft storage and the minting transaction is executed.

![minting](/doc-img/minting.png?raw=true "Miniting screenshot")


Notes:

The lady on the sample NFT does not exist. The picture comes from
https://thispersondoesnotexist.com/ . ECG samples for the simulator
were downloaded from https://data.mendeley.com/ .
