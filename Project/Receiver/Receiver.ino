#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Wire.h>

#include <SPI.h>
#include <LoRa.h>
#include <BluetoothSerial.h>

//define the pins used by the LoRa transceiver module
#define SCK 5
#define MISO 19
#define MOSI 27
#define SS 18
#define RST 14
#define DIO0 26

//433E6 for Asia
//866E6 for Europe
//915E6 for North America
#define BAND 866E6

//OLED pins
#define OLED_SDA 4
#define OLED_SCL 15 
#define OLED_RST 16
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels

#define RED 21
#define GREEN 13

String device_name = "interesting";
BluetoothSerial SerialBT;

String LoRaData;

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RST);

unsigned char ringMode = 0;

void setup()
{
  Serial.begin(115200);

  pinMode(RED, OUTPUT);
  pinMode(GREEN, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);

  //reset OLED display via software
  pinMode(OLED_RST, OUTPUT);
  digitalWrite(OLED_RST, LOW);
  delay(20);
  digitalWrite(OLED_RST, HIGH);

  //initialize OLED
  Wire.begin(OLED_SDA, OLED_SCL);
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3c, false, false)) { // Address 0x3C for 128x32
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }

  //SPI LoRa pins
  SPI.begin(SCK, MISO, MOSI, SS);
  //setup LoRa transceiver module
  LoRa.setPins(SS, RST, DIO0);

  if (!LoRa.begin(BAND)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }
  Serial.println("LoRa Initializing OK!");

	SerialBT.begin(device_name); //Bluetooth device name
  Serial.printf("The device with name \"%s\" is started.\nNow you can pair it with Bluetooth!\n", device_name.c_str());

  display.clearDisplay();
  display.setTextColor(WHITE);
  display.setTextSize(1);
  displayScreen();
}

void loop()
{
  int packetSize = LoRa.parsePacket();
  if (packetSize) {
    //received a packet
    //read packet
    while (LoRa.available()) {
      LoRaData = LoRa.readString();
      Serial.printf("LoRa: %s\n",LoRaData);
      handleLoRa();
    }
  }

	if (SerialBT.available()) {
    int res = SerialBT.read();
    Serial.printf("BT: %d\n",res);
    handleBT(res);
  }
}

void handleBT(int cmd) {
  switch (cmd)
  {
  case 49:
    // test ring
    ring();
    break;
  case 50:
    // next setting
    ringMode++;
    ringMode %= 4;
    break;
  case 51:
    if (ringMode <= 0) ringMode = 4;
    ringMode--;
    break;
  
  default:
    // invalid
    Serial.printf("Invalid BT packet: %d\n", cmd);
    break;
  }
  displayScreen();
}

void handleLoRa() {
  ring();
}

const char* getRingName(int setting) {
  switch (setting)
  {
  case 0:
    return "Slow Alternating";
    break;
  case 1:
    return "Fast Alternating";
    break;
  case 2:
    return "Slow Combined";
    break;
  case 3:
    return "Fast Combined";
    break;
  
  default:
    return "Unknown";
    break;
  }
}

void ring() {
  // all rings should last 10 seconds
  switch (ringMode)
  {
  case 0:
    for (int i = 0; i < 5; i++) {
      digitalWrite(GREEN, HIGH);
      delay(1000);
      digitalWrite(GREEN, LOW);
      digitalWrite(RED, HIGH);
      delay(1000);
      digitalWrite(RED, LOW);
    }
    
    break;
  case 1:
    for (int i = 0; i < 20; i++) {
      digitalWrite(GREEN, HIGH);
      delay(250);
      digitalWrite(GREEN, LOW);
      digitalWrite(RED, HIGH);
      delay(250);
      digitalWrite(RED, LOW);
    }
    break;
  case 2:
    for (int i = 0; i < 5; i++) {
      digitalWrite(GREEN, HIGH);
      digitalWrite(RED, HIGH);
      delay(1000);
      digitalWrite(GREEN, LOW);
      digitalWrite(RED, LOW);
      delay(1000);
    }
    break;
  case 3:
    for (int i = 0; i < 20; i++) {
      digitalWrite(GREEN, HIGH);
      digitalWrite(RED, HIGH);
      delay(250);
      digitalWrite(GREEN, LOW);
      digitalWrite(RED, LOW);
      delay(250);
    }
    break;
  
  default:
    for (int i = 0; i < 5; i++) {
      digitalWrite(LED_BUILTIN, HIGH);
      delay(1000);
      digitalWrite(LED_BUILTIN, LOW);
      delay(1000);
    }
    break;
  }
  digitalWrite(RED, LOW);
  digitalWrite(GREEN, LOW);
}

void displayScreen() {
  const char* name = getRingName(ringMode);
  display.clearDisplay();
  display.setCursor(0,0);
  display.print("Doorbell Receiver");
  display.setCursor(0,10);
  display.printf("Ring Mode: \n%s", name);
  display.display();
}