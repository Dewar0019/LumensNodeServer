#!/bin/bash

echo $1

rfcomm connect 0 $1 1>/dev/null &
sleep 3

result=$(hcitool rssi $1 | awk '/value/ {print $1}')
#looks for the word value at end of string
echo $result


