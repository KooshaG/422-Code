#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <BluetoothSerial.h>

#define BUZZER 21


const char* ssid = "Gull";
const char* pword = "702rlb65";

const char* server = "https://iotjukebox.onrender.com/song";

DynamicJsonDocument responseDocument(21808);

BluetoothSerial BTSerial;
// static bool btScanAsync = true;
// static bool btScanSync = true;

void setup()
{
  Serial.begin(9600);
  // BTSerial.begin(F("Koosha"));
  // Serial.println(F("The device started, now you can pair it with bluetooth!"));

  // if (btScanAsync) {
  //   Serial.print(F("Starting discoverAsync..."));
  //   if (BTSerial.discoverAsync(btAdvertisedDeviceFound)) {
  //     Serial.println(F("Findings will be reported in \"btAdvertisedDeviceFound\""));
  //     delay(10000);
  //     Serial.print(F("Stopping discoverAsync... "));
  //     BTSerial.discoverAsyncStop();
  //     Serial.println(F("stopped"));
  //   } else {
  //     Serial.println(F("Error on discoverAsync f.e. not workin after a \"connect\""));
  //   }
  // }

  WiFi.begin(ssid, pword);
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  Serial.println(F("Connected"));

  pinMode(BUILTIN_LED, OUTPUT);
}

const char* name;
u8_t tempo;
JsonArray melody;

int noteKey, noteDuration;
int wholeNote;
bool noteGathered = false;

void loop()
{
  noteKey, noteDuration = 0;
  noteGathered = false;

  httpGETRequest(server);
  name = responseDocument["name"]; // name of song
  tempo = responseDocument["tempo"]; // song tempo
  melody = responseDocument["melody"]; // melody

  wholeNote = (60000 * 4) / tempo;
  
  Serial.print(F("Song Name: "));
  Serial.println(name);
  Serial.print(F("Tempo: ")); 
  Serial.println(tempo);

  for (int note : melody){
    if (!noteGathered){ // just get the note, do the rest of the processing when we have note and duration
      noteKey = note;
      noteGathered = true;
    }
    else { // get note duration
      if (note > 0) noteDuration = (wholeNote) / note;
      else if (note < 0) {
        noteDuration = (wholeNote) / abs(note);
        noteDuration *= 1.5;
      }
      else noteDuration = wholeNote;
      Serial.print(noteKey);
      Serial.print(F(", "));
      Serial.print(noteDuration);
      Serial.print(F(", "));
      Serial.println(note);
      // play tone
      tone(BUZZER, noteKey, noteDuration*0.9);
      delay(noteDuration);
      noTone(BUZZER);

      noteGathered = false;
    }
  }
}

void httpGETRequest(const char* serverName) {
  HTTPClient http;
  http.useHTTP10(true);
  http.begin(serverName);
  int httpResponseCode = http.GET();

  if (httpResponseCode>0) {
    DeserializationError err = deserializeJson(responseDocument, http.getStream());
    if (err) {
      Serial.print(F("Error: "));
      Serial.println(err.f_str());
    }
  }
  http.end();
  Serial.print("Doc size:");
  Serial.println(responseDocument.memoryUsage());
}

// void btAdvertisedDeviceFound(BTAdvertisedDevice* pDevice) {
// 	Serial.printf("Found a device asynchronously: %s\n", pDevice->toString().c_str());
// }