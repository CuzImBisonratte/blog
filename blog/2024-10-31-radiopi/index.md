---
slug: radiopi
title: Automating IR Remote Control with Raspberry Pi Pico
authors: [konstantin]
---

I own a Music-System that is controlled by an IR-Remote. As I use it as a Speaker for my Computer I have to turn it on manually every time I want to use it. So I thought about automating the process with a Raspberry Pi Pico.

<!-- truncate -->

## The Tech

The Music System is a PEAQ 310BT-SL. On the remote there is no part number or anything, so I can't really tell you what remote it is. But it is the one that comes with the Music System.  
The Pi I use for this project is a Raspberry Pi Pico W. I chose the Pico because it is small and also I wanted to learn micropython.

## Proof of Concept

I started knowing nothing about the remote and how IR even works. But I knew that I can look through a camera and if the remote is working I can see the IR-LED lighting up. So I did that and saw the LED lighting up. So I knew that the remote is using IR.

### Hardware setup

I use a IR-Receiver on a board that has the output pins labelled as G, R and Y. The G pin is connected to the GND pin on the Pico, the R pin is connected to the 3V3 pin on the Pico and the Y pin is connected to pin 16 on the Pico.

### Reading the Codes

Then I looked around to find out how IR works on a Pi pico and found the following library: [Github: peterhinch/micropython_ir](https://github.com/peterhinch/micropython_ir). I installed it on the pi using Thonny and then used the code from the [receiver documentation](https://github.com/peterhinch/micropython_ir/blob/master/RECEIVER.md) to find out the used protocol:

```python
from ir_rx.test import test
from ir_rx.acquire import test
test()
```

After 2 tries I found out that the remote uses the NEC protocol. I didn't know whether NEC_8 or NEC_16 is used, but I just tried NEC_8 - that didn't work. So I tried NEC_16 and that worked. So I knew that the remote uses the NEC_16 protocol.

Then I used the following code to get the codes from the remote:

```python
import time
from machine import Pin
from ir_rx.nec import NEC_16  # NEC remote, 8 bit addresses

def callback(data, addr, ctrl):
    if data < 0:  # NEC protocol sends repeat codes.
        print('Repeat code.')
    else:
        print('Data {:02x} Addr {:04x}'.format(data, addr))

ir = NEC_16(Pin(16, Pin.IN), callback)
while True:
    time.sleep_ms(500)
```

#### Codes from the Remote

The Adress given by the remote is always 0401. The Data is different for every button. Here are the codes I got:

<details>
<summary>Table of the Codes</summary>

| Button        | Data |
| ------------- | ---- |
| Power         | 04   |
| Eject Disk    | 08   |
| Menu          | 47   |
| 10-           | 4B   |
| Volume +      | 4C   |
| 10+           | 4D   |
| Back          | 4E   |
| Play/Pause    | 4F   |
| Forward       | 50   |
| Fold -        | 51   |
| Volume -      | 52   |
| Fold +        | 53   |
| Sleep Timer   | 54   |
| Intro         | 55   |
| Info          | 56   |
| Switch Source | 57   |
| EQ            | 59   |
| Stop          | 5A   |
| Prog          | 5B   |
| Show clock    | 5D   |
| Mute          | 5E   |

</details>

### Sending the Codes

I used the following code to send the codes:

```python
from machine import Pin
from ir_tx.nec import NEC

addr = 0x0401
data = 0x5E

nec = NEC(Pin(17, Pin.OUT, value = 0))
nec.transmit(addr, data)
```

And e' voila, the Music System toggled the mute Function.

## Making it a real working Project

After knowing that the method I used works, I wanted to write a full on remote control.

My requirements were that I wanted to be able to trigger any command recorded from the remote via HTTP-Requests.  
Using the micopython libraries `socket` and `network` I wrote the code to listen for HTTP-Requests and then send the corresponding IR-Code.

Also I wanted to have two other endpoints:  
One to turn on the Music System, then switch to the correct source and then turn up the volume to maximum,
and one command to just turn up the volume to maximum.

You can find the full code on my [GitHub](https://github.com/CuzImBisonratte/RadioPi) or also here:

<details>
<summary>Full Code</summary>

```python
# Settings
ADDR = 0x0401
DATA = {
    "power": 0x04,	"eject": 0x08,      "menu": 0x47,
    "10dwn": 0x4B,	"volUp": 0x4C,	    "10up": 0x4D,
    "back": 0x4E,	"pause": 0x4F,	    "frwd": 0x50,
    "foldDwn": 0x51,    "volDwn": 0x52,	    "foldUp": 0x53,
    "sleep": 0x54,	"intro": 0x55,	    "info": 0x56,
    "src": 0x57,	"eq": 0x59,	    "stop": 0x5A,
    "prog": 0x5B,	"clock": 0x5D,	    "mute": 0x5E
}
WIFI_SSID=""
WIFI_PASS=""

# Libraries
import time
import socket
import network
from machine import Pin
from ir_tx.nec import NEC

# Network Stuff
network.country('DE')
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.config(pm = 0xa11140) # Disable WiFi Standby
wlan.connect(WIFI_SSID, WIFI_PASS)

# Webserver (API)
addr = socket.getaddrinfo('0.0.0.0', 80)[0][-1]
server = socket.socket()
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind(addr)
server.listen(1)

# Connect to wifi
while not wlan.isconnected() and wlan.status() >= 0:
    time.sleep(1)

# Setup IR Blaster
nec = NEC(Pin(17, Pin.OUT, value = 0))

# Webserver
while True:
    try:
        # Accept traffic
        conn, addr = server.accept()
        print('HTTP-Request von Client', addr)
        request = conn.recv(1024)
        # Handle request
        request = str(request)
        request = request.split()
        if "/cmd/" in request[1]:
            cmd = request[1].replace("/cmd/", "")
            print(cmd)
            if cmd in DATA:
                conn.send('HTTP/1.0 200 OK\r\nContent-type: application/json\r\n\r\n')
                conn.send('{"success":true,"cmd":"'+cmd+'"}')
                # Send IR Command
                nec.transmit(ADDR, DATA[cmd])
            else:
                conn.send('HTTP/1.0 404 NOT FOUND\r\nContent-type: application/json\r\n\r\n')
                conn.send('{"cmd":"Not found"}')
        # Custom command for max vol
        elif request[1] == "/volMax":
            for i in range(32):
                nec.transmit(ADDR, DATA["volUp"])
                time.sleep(0.3)
            conn.send('HTTP/1.0 200 OK\r\n\r\n')
        # Custom command for startup sequence
        elif request[1] == "/init":
            conn.send('HTTP/1.0 200 OK\r\n\r\n')
            nec.transmit(ADDR, DATA["power"])
            time.sleep(7.5)
            for i in range(4):
                nec.transmit(ADDR, DATA["src"])
                time.sleep(1)
            time.sleep(5)
            for i in range(32):
                nec.transmit(ADDR, DATA["volUp"])
                time.sleep(0.3)
        else:
            conn.send('HTTP/1.0 404 NOT FOUND\r\nContent-type: application/json\r\n\r\n')
            conn.send('{"cmd":"Not found"}')
        conn.close()
    except OSError as e:
        break
    except (KeyboardInterrupt):
        break
```

</details>

It logs into the home wifi and then listens for HTTP-Requests on port 80.
Any command recorded can be run by sending a GET request to `/cmd/<COMMAND>`.

## Conclusion

Replacing a remote with a Raspberry Pi Pico is a fun project and also very useful.  
The cost of everything (Pico, IR-Receiver, Wires) was around 5€, so it is also very cheap.

I hope you enjoyed this blog post and maybe you will also try to automate your remote controlled devices.

**Thanks for reading!**
