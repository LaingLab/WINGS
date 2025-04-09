### Brainstorm

- Device List
- Connect/Disconnect Buttons + State
- Prime/Unprime Buttons + State
- Testing area for different functions (light, triggers)
- Data area for mapping I/O and seeing I/O output

### Stuff

- ArduinoSelect for device list / selecting
- Figure out data/io layers for mapping and getting filtered I/O output
  - Seperate event listeners?
  - Filtering based on string?
  - Whats the best option
- Figure out model for state montioring/management

### Steps

1. Backend
   a. Connection management
   b. Data transfer & retreval
   c. Pin infomation & usage
   d. Error management & cleanup
2. Frontend
   a. Establish API calls for backend functions
   b. Send data and events
   c. Handle incoming data and events
   d. Display data in ui
