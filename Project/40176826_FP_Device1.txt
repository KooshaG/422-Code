#include <SPI.h>
#include <LoRa.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define SCK 5
#define MISO 19
#define MOSI 27
#define SS 18
#define RST 23
#define DIO0 26

//433E6 for Asia
//866E6 for Europe
//915E6 for North America
#define BAND 866E6

#define BUTTON 4

const char* ssid = "Gull";
const char* pword = "702rlb65";

// const char* ssid = "SM-G965W8193";
// const char* pword = "opcb0593";

DynamicJsonDocument registrationResponseDocument(64); // id : <id>, registrationCode: <code>


bool pressed = false;
int id = 29;

void setup()
{
	Serial.begin(115200);

  pinMode(BUTTON, INPUT_PULLUP);
  pinMode(LED_BUILTIN, OUTPUT);

  WiFi.begin(ssid, pword);
  while(WiFi.status() != WL_CONNECTED) {
    Serial.println("Connecting...");
    delay(500);
  }
  Serial.println(F("Connected"));

  if (id == 0) {
    doorbellRegister();
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
  
  attachInterrupt(digitalPinToInterrupt(BUTTON), isr, RISING);
}

void loop()
{
	if (pressed) {
    Serial.println("Button pressed!");
    Serial.printf("Doorbell Id: %d\n", id);
    bool res = ringDoorbell();
    if (res) {
      LoRa.beginPacket();
      LoRa.print("1");
      LoRa.endPacket();
    }
    pressed = false;
    digitalWrite(LED_BUILTIN, LOW);
  }
}

void isr() {
  pressed = true;
  digitalWrite(LED_BUILTIN, HIGH);
}

void doorbellRegister() {
  // make request for id and output registration code
  HTTPClient http;
  http.useHTTP10(true);
  String url = "https://422.koosha.dev/api/device/register";
  http.begin(url);
  int httpResponseCode = http.GET();

  if (httpResponseCode == 200) {
    DeserializationError err = deserializeJson(registrationResponseDocument, http.getStream());
    if (err) {
      Serial.print(F("Error: "));
      Serial.println(err.f_str());
    }
  } 
  else {
    Serial.println(F("Error with fetch"));
    Serial.print(F("Url: "));
    Serial.println(url);
    Serial.println(http.getString());
  }
  http.end();
  id = registrationResponseDocument["id"].as<int>();
  Serial.print("Doc size:");
  Serial.println(registrationResponseDocument.memoryUsage());
  Serial.print("Registration Code: ");
  Serial.println(registrationResponseDocument["registrationCode"].as<String>());
}

bool ringDoorbell() {
  HTTPClient http;
  http.useHTTP10(true);
  String url = "https://422.koosha.dev/api/device/ring?id=" + String(id);
  // Serial.println(url);
  http.begin(url);
  int httpResponseCode = http.GET();
  bool res = false;

  if (httpResponseCode == 200) {
    Serial.println("ringing doorbell");
    res = true;
  } 
  else {
    Serial.println("silent mode is on, cant ring");
    res = false;
  }
  http.end();
  return res;
}