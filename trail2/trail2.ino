#define BLYNK_TEMPLATE_ID "TMPL3zjx-wb39"
#define BLYNK_TEMPLATE_NAME "SMART KETHI"
#define BLYNK_AUTH_TOKEN "Opp6aAuxECoerDXTJovsui-57Bv-ZIre"

#include <U8g2lib.h>
#include <Wire.h>
#include <ESP8266WiFi.h> 
#include <BlynkSimpleEsp8266.h>
#include <DHT.h>

// Define the possible I2C addresses for the display
#define SCREEN_ADDRESS_1 0x78
#define SCREEN_ADDRESS_2 0x7A

U8G2_SSD1306_128X64_NONAME_F_SW_I2C u8g2(U8G2_R0, /* clock=*/ D1, /* data=*/ D2, /* reset=*/ U8X8_PIN_NONE);

// char ssid[] = "Airtel_2.4GHz_Hello Baby";
// char pass[] = "Moneybro2";
// char ssid[] = "ShiriRam";
// char pass[] = "9617973496";

char ssid[] = "iqqq";
char pass[] = "12345678";

char auth[] = BLYNK_AUTH_TOKEN; // Your Blynk Auth Token

// int wetSoilVal = 930 ;  //min value when soil is wet
// int drySoilVal = 3000 ;  //max value when soil is dry

int moistPerLow =   37 ;  //min moisture %
int moistPerHigh =   65 ;  //max moisture %

// int     sensorVal;
// int     value;

#define BLYNK_PRINT Serial
#define DHTPIN D4 // Connect DHT sensor to D4 in NODE MCU
#define DHTTYPE DHT11 
#define waterPump D3 
DHT dht(DHTPIN, DHTTYPE);

BlynkTimer timer;
// bool Relay = 0;

int     moisturePercentage;
bool    toggleRelay = LOW; //Define to remember the toggle state
bool    prevMode = true;

BLYNK_WRITE(V3) {
  int relayState = param.asInt();
  digitalWrite(waterPump, relayState); // Set water pump state based on Blynk switch
}

void controlMoist() {
  if(prevMode){
    if (moisturePercentage < moistPerLow){
      if (toggleRelay == HIGH){
        digitalWrite(waterPump, LOW);
        toggleRelay = LOW;
        Blynk.virtualWrite(V3, toggleRelay); // Update Blynk switch state
      }      
    }
    if (moisturePercentage > moistPerHigh){
      if (toggleRelay == LOW){
        digitalWrite(waterPump, HIGH);
        toggleRelay = HIGH;
        Blynk.virtualWrite(V3, toggleRelay); // Update Blynk switch state
      } 
    } 
  }
}

void setup() {
  pinMode(D0, OUTPUT);
  Serial.begin(115200);
  pinMode(waterPump, OUTPUT);
  digitalWrite(waterPump, HIGH);

  dht.begin();
  timer.setInterval(100L, sendSensor);

  Wire.begin();
  u8g2.setI2CAddress(SCREEN_ADDRESS_1); // Change this if your display address is different
  u8g2.begin();

  Blynk.begin(auth, ssid, pass);
}

void loop() {
  digitalWrite(D0, HIGH);
  delay(2000);
  digitalWrite(D0, LOW);
  delay(1000);
  Blynk.run();
  getAndDisplayData();
  timer.run();
  controlMoist();
}



void sendSensor()
{
  /*int soilmoisturevalue = analogRead(A0);
   soilmoisturevalue = map(soilmoisturevalue, 0, 1023, 0, 100);*/
  int value = analogRead(A0);
  value = map(value, 0, 1024, 0, 100);
  value = (value - 100) * -1;
  moisturePercentage = value;
  float h = dht.readHumidity();
  float t = dht.readTemperature(); // or dht.readTemperature(true) for Fahrenheit

  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  // You can send any value at any time.
  // Please don't send more that 10 values per second.
    Blynk.virtualWrite(V0, value);
    Blynk.virtualWrite(V1, t);
    Blynk.virtualWrite(V2, h);
    Serial.print("Soil Moisture : ");
    Serial.print(value);
    Serial.print("Temperature : ");
    Serial.print(t);
    Serial.print("    Humidity : ");
    Serial.println(h);
}

void getAndDisplayData() {
  int value = analogRead(A0);
  value = map(value, 0, 1024, 0, 100);
  value = (value - 100) * -1;
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  u8g2.clearBuffer();
  u8g2.setFont(u8g2_font_ncenB10_tr);
  
  // Print Soil Moisture
  u8g2.setCursor(1, 15);
  u8g2.print("Soil Mois: ");
  u8g2.print(value);
  u8g2.print("%");
  

  // Print Temperature
  u8g2.setCursor(1, 30);
  u8g2.print("Temp: ");
  u8g2.print(t, 2); // Print temperature with 2 decimal places
  u8g2.print(" C");

  // Print Humidity
  u8g2.setCursor(1, 45);
  u8g2.print("Hum: ");
  u8g2.print(h, 2); // Print humidity with 2 decimal places
  u8g2.print("%");

  // Print Pump Status
  u8g2.setCursor(1, 60);
  u8g2.print("Pump: ");
  int RelayState = digitalRead(waterPump);
  if (RelayState == HIGH)
    u8g2.print("Off");
  else
    u8g2.print("On");

  u8g2.sendBuffer();
}


