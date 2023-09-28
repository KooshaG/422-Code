#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// #include <Wire.h>
// #include <Adafruit_GFX.h>
// #include <Adafruit_SSD1306.h>

// #define OLED_ADDRESS    0x3C
// #define OLED_SDA    4
// #define OLED_SCL    15
// #define OLED_RST    16
// #define SCREEN_WIDTH 128
// #define SCREEN_HEIGHT 64

// Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RST);

const char* ssid = "Gull";
const char* pword = "702rlb65";

const char* server = "https://iotjukebox.onrender.com/song";

StaticJsonDocument<12288> responseDocument;

void setup()
{
  // initOLED();
  Serial.begin(9600);

  // display.setTextColor(WHITE);
  // display.setTextSize(1);
  // display.setCursor(0,0);

  WiFi.begin(ssid, pword);
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    // display.print(".");
  }
  Serial.println("Connected");
  // clearPrintToScreen("Connected");
  // display.println();
  // display.print(WiFi.localIP());
  // display.display();

  pinMode(BUILTIN_LED, OUTPUT);

  httpGETRequest(server);
  // serializeJson(responseDocument, Serial);
  delay(5000);
  const char* what = responseDocument["name"];
  Serial.println(what);
  Serial.println("done");

  // clearPrintToScreen(JSON.stringify(name).c_str());

}

void loop()
{
  digitalWrite(BUILTIN_LED, HIGH);
  delay(1000);
  digitalWrite(BUILTIN_LED, LOW);
  delay(1000);

}

// void initOLED()
// {
//   pinMode(OLED_RST, OUTPUT);
//   digitalWrite(OLED_RST, LOW);
//   delay(20);
//   digitalWrite(OLED_RST, HIGH);
//   Wire.begin(OLED_SDA, OLED_SCL);
//   if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3c, false, false)) { // Address 0x3C for 128x32
//   for(;;); // Don't proceed, loop forever
//   }
// }

// void clearPrintToScreen(const char* str)
// {
//   display.clearDisplay();
//   display.setCursor(0,0);
//   display.print(str);
//   display.display();
// }

void httpGETRequest(const char* serverName) {
  HTTPClient http;
  http.begin(serverName);
  int httpResponseCode = http.GET();

  if (httpResponseCode>0) {
    DeserializationError err = deserializeJson(responseDocument, http.getString().c_str());
    if (err) {
      Serial.print("Error: ");
      Serial.println(err.f_str());
    }
  }
  http.end();
}