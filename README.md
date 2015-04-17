# sprinklr
This is the host application that communicates with the Arduino layer to control the relays attached to the sprinklers.

# Arduino USB command API
Since char seems to work best, the API is as follows:
* a - starts zone 1
* b - stops zone 1
* c - start zone 2
* d - stop zone 2
* e - start zone 3
* f - stop zone 3
* g - start zone 4
* h - stop zone 4
