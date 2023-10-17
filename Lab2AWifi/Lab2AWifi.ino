#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>


#define BUZZER 21
#define RX2 16
#define TX2 17


// const char* ssid = "Gull";
// const char* pword = "702rlb65";

const char* ssid = "KG-SURFACE8767";
const char* pword = "7@As4972";


DynamicJsonDocument songResponseDocument(21808); // song with melody
DynamicJsonDocument preferenceResponseDocument(64); // name : <songname>

void setup()
{
  Serial.begin(9600);
  Serial2.begin(9600);

  WiFi.begin(ssid, pword);
  while(WiFi.status() != WL_CONNECTED) {
    Serial.println("Connecting...");
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

  Serial.println(httpGETPreference(1));

  httpGETSong("doom");
  name = songResponseDocument["name"]; // name of song
  tempo = songResponseDocument["tempo"]; // song tempo
  melody = songResponseDocument["melody"]; // melody

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

void httpGETSong(String songname) {
  HTTPClient http;
  http.useHTTP10(true);
  String url = "https://iotjukebox.onrender.com/song?name=" + songname;
  http.begin(url);
  int httpResponseCode = http.GET();

  if (httpResponseCode>0) {
    DeserializationError err = deserializeJson(songResponseDocument, http.getStream());
    if (err) {
      Serial.print(F("Error: "));
      Serial.println(err.f_str());
    }
  }
  http.end();
  Serial.print("Doc size:");
  Serial.println(songResponseDocument.memoryUsage());
}

String httpGETPreference(const char username) {
  HTTPClient http;
  http.useHTTP10(true);
  String url = "https://iotjukebox.onrender.com/preference?id=40176826&key=" + username;
  http.begin(url);
  int httpResponseCode = http.GET();

  if (httpResponseCode>0) {
    DeserializationError err = deserializeJson(preferenceResponseDocument, http.getStream());
    if (err) {
      Serial.print(F("Error: "));
      Serial.println(err.f_str());
    }
  }
  http.end();
  return preferenceResponseDocument["name"].as<String>();
}