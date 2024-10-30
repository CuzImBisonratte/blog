"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[60],{1117:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>s,default:()=>l,frontMatter:()=>i,metadata:()=>d,toc:()=>a});var r=t(4848),o=t(8453);const i={slug:"radiopi",title:"Automating IR Remote Control with Raspberry Pi Pico",authors:["konstantin"]},s=void 0,d={permalink:"/radiopi",source:"@site/blog/2024-10-31-radiopi/index.md",title:"Automating IR Remote Control with Raspberry Pi Pico",description:"I own a Music-System that is controlled by an IR-Remote. As I use it as a Speaker for my Computer I have to turn it on manually every time I want to use it. So I thought about automating the process with a Raspberry Pi Pico.",date:"2024-10-31T00:00:00.000Z",tags:[],readingTime:5.31,hasTruncateMarker:!0,authors:[{name:"Konstantin Protzen",title:"Hobby-Fullstack-Dev",url:"https://github.com/cuzimbisonratte",imageURL:"https://github.com/cuzimbisonratte.png",key:"konstantin"}],frontMatter:{slug:"radiopi",title:"Automating IR Remote Control with Raspberry Pi Pico",authors:["konstantin"]},unlisted:!1,nextItem:{title:"Replacing XAMPP under Ubuntu",permalink:"/xampp-replacement"}},c={authorsImageUrls:[void 0]},a=[{value:"The Tech",id:"the-tech",level:2},{value:"Proof of Concept",id:"proof-of-concept",level:2},{value:"Hardware setup",id:"hardware-setup",level:3},{value:"Reading the Codes",id:"reading-the-codes",level:3},{value:"Codes from the Remote",id:"codes-from-the-remote",level:4},{value:"Sending the Codes",id:"sending-the-codes",level:3},{value:"Making it a real working Project",id:"making-it-a-real-working-project",level:2},{value:"Conclusion",id:"conclusion",level:2}];function h(e){const n={a:"a",br:"br",code:"code",h2:"h2",h3:"h3",h4:"h4",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,o.R)(),...e.components},{Details:t}=n;return t||function(e,n){throw new Error("Expected "+(n?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.p,{children:"I own a Music-System that is controlled by an IR-Remote. As I use it as a Speaker for my Computer I have to turn it on manually every time I want to use it. So I thought about automating the process with a Raspberry Pi Pico."}),"\n",(0,r.jsx)(n.h2,{id:"the-tech",children:"The Tech"}),"\n",(0,r.jsxs)(n.p,{children:["The Music System is a PEAQ 310BT-SL. On the remote there is no part number or anything, so I can't really tell you what remote it is. But it is the one that comes with the Music System.",(0,r.jsx)(n.br,{}),"\n","The Pi I use for this project is a Raspberry Pi Pico W. I chose the Pico because it is small and also I wanted to learn micropython."]}),"\n",(0,r.jsx)(n.h2,{id:"proof-of-concept",children:"Proof of Concept"}),"\n",(0,r.jsx)(n.p,{children:"I started knowing nothing about the remote and how IR even works. But I knew that I can look through a camera and if the remote is working I can see the IR-LED lighting up. So I did that and saw the LED lighting up. So I knew that the remote is using IR."}),"\n",(0,r.jsx)(n.h3,{id:"hardware-setup",children:"Hardware setup"}),"\n",(0,r.jsx)(n.p,{children:"I use a IR-Receiver on a board that has the output pins labelled as G, R and Y. The G pin is connected to the GND pin on the Pico, the R pin is connected to the 3V3 pin on the Pico and the Y pin is connected to pin 16 on the Pico."}),"\n",(0,r.jsx)(n.h3,{id:"reading-the-codes",children:"Reading the Codes"}),"\n",(0,r.jsxs)(n.p,{children:["Then I looked around to find out how IR works on a Pi pico and found the following library: ",(0,r.jsx)(n.a,{href:"https://github.com/peterhinch/micropython_ir",children:"Github: peterhinch/micropython_ir"}),". I installed it on the pi using Thonny and then used the code from the ",(0,r.jsx)(n.a,{href:"https://github.com/peterhinch/micropython_ir/blob/master/RECEIVER.md",children:"receiver documentation"})," to find out the used protocol:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-python",children:"from ir_rx.test import test\nfrom ir_rx.acquire import test\ntest()\n"})}),"\n",(0,r.jsx)(n.p,{children:"After 2 tries I found out that the remote uses the NEC protocol. I didn't know whether NEC_8 or NEC_16 is used, but I just tried NEC_8 - that didn't work. So I tried NEC_16 and that worked. So I knew that the remote uses the NEC_16 protocol."}),"\n",(0,r.jsx)(n.p,{children:"Then I used the following code to get the codes from the remote:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-python",children:"import time\nfrom machine import Pin\nfrom ir_rx.nec import NEC_16  # NEC remote, 8 bit addresses\n\ndef callback(data, addr, ctrl):\n    if data < 0:  # NEC protocol sends repeat codes.\n        print('Repeat code.')\n    else:\n        print('Data {:02x} Addr {:04x}'.format(data, addr))\n\nir = NEC_16(Pin(16, Pin.IN), callback)\nwhile True:\n    time.sleep_ms(500)\n"})}),"\n",(0,r.jsx)(n.h4,{id:"codes-from-the-remote",children:"Codes from the Remote"}),"\n",(0,r.jsx)(n.p,{children:"The Adress given by the remote is always 0401. The Data is different for every button. Here are the codes I got:"}),"\n",(0,r.jsxs)(t,{children:[(0,r.jsx)("summary",{children:"Table of the Codes"}),(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{children:"Button"}),(0,r.jsx)(n.th,{children:"Data"})]})}),(0,r.jsxs)(n.tbody,{children:[(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Power"}),(0,r.jsx)(n.td,{children:"04"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Eject Disk"}),(0,r.jsx)(n.td,{children:"08"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Menu"}),(0,r.jsx)(n.td,{children:"47"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"10-"}),(0,r.jsx)(n.td,{children:"4B"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Volume +"}),(0,r.jsx)(n.td,{children:"4C"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"10+"}),(0,r.jsx)(n.td,{children:"4D"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Back"}),(0,r.jsx)(n.td,{children:"4E"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Play/Pause"}),(0,r.jsx)(n.td,{children:"4F"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Forward"}),(0,r.jsx)(n.td,{children:"50"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Fold -"}),(0,r.jsx)(n.td,{children:"51"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Volume -"}),(0,r.jsx)(n.td,{children:"52"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Fold +"}),(0,r.jsx)(n.td,{children:"53"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Sleep Timer"}),(0,r.jsx)(n.td,{children:"54"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Intro"}),(0,r.jsx)(n.td,{children:"55"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Info"}),(0,r.jsx)(n.td,{children:"56"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Switch Source"}),(0,r.jsx)(n.td,{children:"57"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"EQ"}),(0,r.jsx)(n.td,{children:"59"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Stop"}),(0,r.jsx)(n.td,{children:"5A"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Prog"}),(0,r.jsx)(n.td,{children:"5B"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Show clock"}),(0,r.jsx)(n.td,{children:"5D"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Mute"}),(0,r.jsx)(n.td,{children:"5E"})]})]})]})]}),"\n",(0,r.jsx)(n.h3,{id:"sending-the-codes",children:"Sending the Codes"}),"\n",(0,r.jsx)(n.p,{children:"I used the following code to send the codes:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-python",children:"from machine import Pin\nfrom ir_tx.nec import NEC\n\naddr = 0x0401\ndata = 0x5E\n\nnec = NEC(Pin(17, Pin.OUT, value = 0))\nnec.transmit(addr, data)\n"})}),"\n",(0,r.jsx)(n.p,{children:"And e' voila, the Music System toggled the mute Function."}),"\n",(0,r.jsx)(n.h2,{id:"making-it-a-real-working-project",children:"Making it a real working Project"}),"\n",(0,r.jsx)(n.p,{children:"After knowing that the method I used works, I wanted to write a full on remote control."}),"\n",(0,r.jsxs)(n.p,{children:["My requirements were that I wanted to be able to trigger any command recorded from the remote via HTTP-Requests.",(0,r.jsx)(n.br,{}),"\n","Using the micopython libraries ",(0,r.jsx)(n.code,{children:"socket"})," and ",(0,r.jsx)(n.code,{children:"network"})," I wrote the code to listen for HTTP-Requests and then send the corresponding IR-Code."]}),"\n",(0,r.jsxs)(n.p,{children:["Also I wanted to have two other endpoints:",(0,r.jsx)(n.br,{}),"\n","One to turn on the Music System, then switch to the correct source and then turn up the volume to maximum,\nand one command to just turn up the volume to maximum."]}),"\n",(0,r.jsxs)(n.p,{children:["You can find the full code on my ",(0,r.jsx)(n.a,{href:"https://github.com/CuzImBisonratte/RadioPi",children:"GitHub"})," or also here:"]}),"\n",(0,r.jsxs)(t,{children:[(0,r.jsx)("summary",{children:"Full Code"}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-python",children:'# Settings\nADDR = 0x0401\nDATA = {\n    "power": 0x04,\t"eject": 0x08,      "menu": 0x47,\n    "10dwn": 0x4B,\t"volUp": 0x4C,\t    "10up": 0x4D,\n    "back": 0x4E,\t"pause": 0x4F,\t    "frwd": 0x50,\n    "foldDwn": 0x51,    "volDwn": 0x52,\t    "foldUp": 0x53,\n    "sleep": 0x54,\t"intro": 0x55,\t    "info": 0x56,\n    "src": 0x57,\t"eq": 0x59,\t    "stop": 0x5A,\n    "prog": 0x5B,\t"clock": 0x5D,\t    "mute": 0x5E\n}\nWIFI_SSID=""\nWIFI_PASS=""\n\n# Libraries\nimport time\nimport socket\nimport network\nfrom machine import Pin\nfrom ir_tx.nec import NEC\n\n# Network Stuff\nnetwork.country(\'DE\')\nwlan = network.WLAN(network.STA_IF)\nwlan.active(True)\nwlan.config(pm = 0xa11140) # Disable WiFi Standby\nwlan.connect(WIFI_SSID, WIFI_PASS)\n\n# Webserver (API)\naddr = socket.getaddrinfo(\'0.0.0.0\', 80)[0][-1]\nserver = socket.socket()\nserver.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)\nserver.bind(addr)\nserver.listen(1)\n\n# Connect to wifi\nwhile not wlan.isconnected() and wlan.status() >= 0:\n    time.sleep(1)\n\n# Setup IR Blaster\nnec = NEC(Pin(17, Pin.OUT, value = 0))\n\n# Webserver\nwhile True:\n    try:\n        # Accept traffic\n        conn, addr = server.accept()\n        print(\'HTTP-Request von Client\', addr)\n        request = conn.recv(1024)\n        # Handle request\n        request = str(request)\n        request = request.split()\n        if "/cmd/" in request[1]:\n            cmd = request[1].replace("/cmd/", "")\n            print(cmd)\n            if cmd in DATA:\n                conn.send(\'HTTP/1.0 200 OK\\r\\nContent-type: application/json\\r\\n\\r\\n\')\n                conn.send(\'{"success":true,"cmd":"\'+cmd+\'"}\')\n                # Send IR Command\n                nec.transmit(ADDR, DATA[cmd])\n            else:\n                conn.send(\'HTTP/1.0 404 NOT FOUND\\r\\nContent-type: application/json\\r\\n\\r\\n\')\n                conn.send(\'{"cmd":"Not found"}\')\n        # Custom command for max vol\n        elif request[1] == "/volMax":\n            for i in range(32):\n                nec.transmit(ADDR, DATA["volUp"])\n                time.sleep(0.3)\n            conn.send(\'HTTP/1.0 200 OK\\r\\n\\r\\n\')\n        # Custom command for startup sequence\n        elif request[1] == "/init":\n            conn.send(\'HTTP/1.0 200 OK\\r\\n\\r\\n\')\n            nec.transmit(ADDR, DATA["power"])\n            time.sleep(7.5)\n            for i in range(4):\n                nec.transmit(ADDR, DATA["src"])\n                time.sleep(1)\n            time.sleep(5)\n            for i in range(32):\n                nec.transmit(ADDR, DATA["volUp"])\n                time.sleep(0.3)\n        else:\n            conn.send(\'HTTP/1.0 404 NOT FOUND\\r\\nContent-type: application/json\\r\\n\\r\\n\')\n            conn.send(\'{"cmd":"Not found"}\')\n        conn.close()\n    except OSError as e:\n        break\n    except (KeyboardInterrupt):\n        break\n'})})]}),"\n",(0,r.jsxs)(n.p,{children:["It logs into the home wifi and then listens for HTTP-Requests on port 80.\nAny command recorded can be run by sending a GET request to ",(0,r.jsx)(n.code,{children:"/cmd/<COMMAND>"}),"."]}),"\n",(0,r.jsx)(n.h2,{id:"conclusion",children:"Conclusion"}),"\n",(0,r.jsxs)(n.p,{children:["Replacing a remote with a Raspberry Pi Pico is a fun project and also very useful.",(0,r.jsx)(n.br,{}),"\n","The cost of everything (Pico, IR-Receiver, Wires) was around 5\u20ac, so it is also very cheap."]}),"\n",(0,r.jsx)(n.p,{children:"I hope you enjoyed this blog post and maybe you will also try to automate your remote controlled devices."}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Thanks for reading!"})})]})}function l(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(h,{...e})}):h(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>s,x:()=>d});var r=t(6540);const o={},i=r.createContext(o);function s(e){const n=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:s(e.components),r.createElement(i.Provider,{value:n},e.children)}}}]);