#!/bin/bash
# declare STRING variable
STRING="Hello World"
#print variable on a screen
echo $STRING

s1="Not Connected."


#sudo hciconfig hci0 piscan

#sudo rfcomm connect 0 EC:AD:B8:0A:BB:AD 1>/dev/null &

#s0=hcitool rssi EC:AD:B8:0A:BB:AD
s0="123"

if [ "$s1" == "$s0" ]; then
	echo $STRING
else
	echo $s1
fi



