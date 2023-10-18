#include <SoftwareSerial.h>
#include <BluetoothSerial.h>

#define RX 25
#define TX 4

#define BT_DISCOVER_TIME	10000


EspSoftwareSerial::UART swSerial; // wifi serial
BluetoothSerial SerialBT;

void btAdvertisedDeviceFound(BTAdvertisedDevice* pDevice) {
	Serial.printf("Found a device asynchronously: %s\n", pDevice->toString().c_str());
  int res = compare(pDevice);
  if (res > 0){
    swSerial.write(compare(pDevice));
  }
}

void setup()
{
  SerialBT.begin("Koosha");
	Serial.begin(9600);
  swSerial.begin(9600, EspSoftwareSerial::SWSERIAL_8N1, RX, TX);
  
}

void loop()
{
	Serial.print("Starting discoverAsync...");
  if (SerialBT.discoverAsync(btAdvertisedDeviceFound)) {
    Serial.println("Findings will be reported in \"btAdvertisedDeviceFound\"");
    delay(55000);
    Serial.print("Stopping discoverAsync... ");
    SerialBT.discoverAsyncStop();
    Serial.println("stopped");
  } else {
    Serial.println("Error on discoverAsync f.e. not workin after a \"connect\"");
  }

  delay(5000);
}

int compare(const BTAdvertisedDevice* bluetoothDevice){
  String name = bluetoothDevice->getName().c_str();
  if (name == "Koosha's S23") return 1;
  if (name == "KG-SURFACE") return 2;
  else return -1;

}