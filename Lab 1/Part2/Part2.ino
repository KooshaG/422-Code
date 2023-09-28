#define RED1 8
#define YELLOW1 7
#define GREEN1 6

#define RED2 12
#define YELLOW2 11
#define GREEN2 10


void setup() {
  // put your setup code here, to run once:
  pinMode(RED1, OUTPUT);
  pinMode(YELLOW1, OUTPUT);
  pinMode(GREEN1, OUTPUT);

  pinMode(RED2, OUTPUT);
  pinMode(YELLOW2, OUTPUT);
  pinMode(GREEN2, OUTPUT);
  
  // pinMode(BUTTON, INPUT);
  // pinMode(LED_BUILTIN, OUTPUT);
  // attachInterrupt(digitalPinToInterrupt(BUTTON), change, RISING);
}

void loop() {
  // put your main code here, to run repeatedly:
  // unsigned long currentMillis = millis();
  digitalWrite(RED1, HIGH);     // red for lane 1
  digitalWrite(GREEN2, HIGH);   // green for lane 2
  delay(4000);
  digitalWrite(GREEN2, LOW);    // yellow for lane 2
  digitalWrite(YELLOW2, HIGH);
  delay(1000);
  digitalWrite(YELLOW2, LOW);   // red for lane 2
  digitalWrite(RED1, LOW);      // green for lane 1
  digitalWrite(RED2, HIGH);
  digitalWrite(GREEN1, HIGH);
  delay(4000);
  digitalWrite(GREEN1, LOW);    // yellow for lane 1
  digitalWrite(YELLOW1, HIGH);
  delay(1000);
  digitalWrite(YELLOW1, LOW);   // turn off leds for loop start
  digitalWrite(RED2, LOW);
}

