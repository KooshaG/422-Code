#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <LinkedList.h>


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
// String preferenceEndpoint = F("preference?id=40176826&key=");
String songEndpoint = F("song?name=");
String randomSongEndpoint = F("song");

LinkedList<String> songList = LinkedList<String>();
int songIndex = 0;
bool playing = true;
bool skipped = false;
int notesPlayed = 0;

void setup()
{
  Serial.begin(9600);
  Serial2.begin(9600); // bt arduino
  Serial2.onReceive(handleRecieve);

  WiFi.begin(ssid, pword);
  while(WiFi.status() != WL_CONNECTED) {
    Serial.println("Connecting...");
    delay(500);
  }
  Serial.println(F("Connected"));

  
}

void loop()
{
  if (songIndex > songList.size()) {
    songIndex = songList.size(); // just make sure that we are only one above the largest index
  }
  if ((songList.size() == 0) || (songIndex >= songList.size())) { // no songs, get random song
    String song = getSong();
    songList.add(song);
    playSong(songResponseDocument);
  } 
  else { // song is in our list
    getSong(songList.get(songIndex));
    playSong(songResponseDocument);
  }

  delay(100);
}

void handleRecieve(){
  int command = Serial2.read();
  Serial.println("Got command:");
  switch (command)
  {
  case 49:
    Serial.println("Toggle");
    playing = !playing;
    Serial.println(playing);
    break;
  case 50:
    Serial.println("Next");
    skipped = true;
    songIndex++;
    Serial.printf("Song List size: %d, Song List index: %d \n", songList.size(), songIndex);
    break;
  case 51:
    Serial.println("Previous");
    skipped = true;
    if (notesPlayed < 5){ // if the song has played for a while, repeat song, don't go back
      songIndex--;
    }
    if (songIndex <= 0) {
      songIndex = 0;
    }
    Serial.printf("Song List size: %d, Song List index: %d \n", songList.size(), songIndex);
    break;
  default:
    Serial.println(command);
    Serial.println("Read Failed");
    break;
  }
}

String getSong(){
  httpGET(randomSongEndpoint, songResponseDocument);
  return songResponseDocument["name"].as<String>();
}

void getSong(String songName){
  httpGET(songEndpoint + songName, songResponseDocument);
}

void playSong(ArduinoJson::V6213PB2::DynamicJsonDocument& song){
  
  String name = song["name"]; // name of song
  u8_t tempo = song["tempo"]; // song tempo
  JsonArray melody = song["melody"]; // melody

  notesPlayed = 0;
  int noteKey, noteDuration = 0;
  bool noteGathered = false;
  int wholeNote = (60000 * 4) / tempo;

  
  Serial.print(F("Song Name: "));
  Serial.println(name);
  Serial.print(F("Tempo: ")); 
  Serial.println(tempo);

  for (int note : melody){
    while (!playing){
      delay(10);
    }
    if (skipped) { 
      Serial.println("skipping");
      break; 
    }
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
      Serial.printf("%d, %d, %d \n", noteKey, noteDuration, note);
      // play tone
      tone(BUZZER, noteKey, noteDuration*0.9);
      delay(noteDuration);
      noTone(BUZZER);
      notesPlayed++;

      noteGathered = false;
    }
  }
  notesPlayed = 0; // reset after song is ended (skipped or finished)
  if (!skipped) { // song finished playing
    songIndex++;
  }
  else { // song got skipped, have to reset bool
    skipped = false;
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