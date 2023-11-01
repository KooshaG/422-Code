#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>


#define BUZZER 21
#define RX 26
#define TX 25

// const char* ssid = "Gull";
// const char* pword = "702rlb65";

const char* ssid = "SM-G965W8193";
const char* pword = "opcb0593";

DynamicJsonDocument songResponseDocument(21808); // song with melody
DynamicJsonDocument preferenceResponseDocument(64); // name : <songname>

String server = F("https://iotjukebox.onrender.com/");
String preferenceEndpoint = F("preference?id=40176826&key=");
String songEndpoint = F("song?name=");

void setup()
{
  Serial.begin(9600);
  Serial2.begin(9600); // bt arduino

  WiFi.begin(ssid, pword);
  while(WiFi.status() != WL_CONNECTED) {
    Serial.println("Connecting...");
    delay(500);
  }
  Serial.println(F("Connected"));

  pinMode(BUILTIN_LED, OUTPUT);
}

int device;

void loop()
{
  while (!Serial2.available()){
    delay(100); // wait for device to be found
  }
  device = Serial2.read();
  Serial.println(device);
  httpGET(preferenceEndpoint + device, preferenceResponseDocument);
  String song = preferenceResponseDocument["name"].as<String>(); 
  Serial.println(song);
  if (song != NULL) {
    playSong(song);
  }
}


void playSong(String songName){
  httpGET(songEndpoint + songName, songResponseDocument);
  const char* name = songResponseDocument["name"]; // name of song
  u8_t tempo = songResponseDocument["tempo"]; // song tempo
  JsonArray melody = songResponseDocument["melody"]; // melody

  int noteKey, noteDuration = 0;
  bool noteGathered = false;
  int wholeNote = (60000 * 4) / tempo;

  
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

void httpGET(String endpoint, ArduinoJson::V6213PB2::DynamicJsonDocument& document) {
  HTTPClient http;
  http.useHTTP10(true);
  String url = server + endpoint;
  http.begin(url);
  int httpResponseCode = http.GET();

  if (httpResponseCode == 200) {
    DeserializationError err = deserializeJson(document, http.getStream());
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
  Serial.print("Doc size:");
  Serial.println(document.memoryUsage());
}
