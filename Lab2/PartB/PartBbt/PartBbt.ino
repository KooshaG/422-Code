#include <SoftwareSerial.h>
#include <BluetoothSerial.h>

#define RX 25
#define TX 4

String device_name = "interesting";

EspSoftwareSerial::UART swSerial; // wifi serial
BluetoothSerial SerialBT;

void setup() {
  Serial.begin(115200);
  swSerial.begin(9600, EspSoftwareSerial::SWSERIAL_8N1, RX, TX);
  SerialBT.begin(device_name); //Bluetooth device name
  Serial.printf("The device with name \"%s\" is started.\nNow you can pair it with Bluetooth!\n", device_name.c_str());
  //Serial.printf("The device with name \"%s\" and MAC address %s is started.\nNow you can pair it with Bluetooth!\n", device_name.c_str(), SerialBT.getMacString()); // Use this after the MAC method is implemented
}

void loop() {
  if (Serial.available()) {
    SerialBT.write(Serial.read());
  }
  if (SerialBT.available()) {
    int res = SerialBT.read();
    Serial.write(res);
    swSerial.write(res);
  }
  delay(20);
}