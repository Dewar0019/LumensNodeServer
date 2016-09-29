#!/bin/bash

rfcomm connect 0 EC:AD:B8:0A:BB:AD 1>/dev/null &
sleep 3

result=$(hcitool rssi EC:AD:B8:0A:BB:AD | awk '/value/ {print $1}')
#looks for the word value at end of string
echo $result


RSSI="RSSI"

