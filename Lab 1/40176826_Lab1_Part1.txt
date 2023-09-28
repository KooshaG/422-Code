#define RED 8
#define YELLOW 7
#define GREEN 6
#define BUTTON 2 // must be 2 or 3 for interrupt

void setup() 
{
  // put your setup code here, to run once:
  pinMode(RED, OUTPUT); // red
  pinMode(YELLOW, OUTPUT); // yellow
  pinMode(GREEN, OUTPUT); // green
  pinMode(BUTTON, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  attachInterrupt(digitalPinToInterrupt(BUTTON), change, RISING);
}
unsigned char order[3] = {RED, YELLOW, GREEN};
unsigned char buttonPressed = 0; // to avoid the button accidentally being pressed twice

void loop() 
{
  // put your main code here, to run repeatedly:
  digitalWrite(order[0], HIGH); // red
  wait(2000);
  digitalWrite(order[0], LOW); // yellow
  digitalWrite(order[1], HIGH);
  wait(1000);
  digitalWrite(order[1], LOW); // green
  digitalWrite(order[2], HIGH);
  wait(500);
  digitalWrite(order[2], LOW); // blank
  wait(500);
}

void wait(unsigned long waitTimeMillis) // wait function that can be interrupted
{
  unsigned long futureMillis = millis() + waitTimeMillis;
  while(futureMillis >= millis()){
   futureMillis == futureMillis; // busy wait
  }
  buttonPressed = 0; 
}

void change(){ // changes the order of red and green leds (basically reverses the order)
  if (!buttonPressed){
    buttonPressed = 1;
    unsigned char temp = order[0];
    order[0] = order[2];
    order[2] = temp;
  }
}