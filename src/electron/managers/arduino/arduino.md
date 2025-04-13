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

### TODO

- [ ] CRUD
  - [ ] Connection
  - [ ] Sending/Receving Data
  - [ ] Proper disconnection and cleanup
- [ ] Logging

So like what do I need to do like
I really need to figure out what tf I need to have done for tmr
SOOO like what does that mean
Ovb its gna be sm like to test the software
so its prob gna have to do with like testing
all they need is like working arduino and like
webcam recording
So basically they just need something that I can load onto da pc, plug in da duino, and run da experiment, doesn't need to be all fancy just needs to work vro smh vro smh

so basically

Open app -> plug in duino -> settings -> run trial -> view results

so basically

Dashboard

- Choose arduino
- Set simple settings
- Some buttons to run trial
- Video preview

Settings

- Settings for arduino
- Settings for video
- Settings for trial

Results

- View past trials
- See that trials video
- Some options to do other stuff

Managers

- Arduino
- Video
- Trial
- Database

Okay so now what should I do next
probably refactor the frontend to reflect these changes
or make trial thing in backend
honestly I need to think about the steps I am taking to develop this more
Its going to need like a trial that can run
That trial needs to be able to handle the arduino and video feed, alongside all data being outputted by both.
Then it must save this data into a csv that can be viewed later.

Trial

check settings -> connect to arduino -> connect to webcam -> start recording -> initialize arduino and begin main loop -> take data until trial is ended

Check settings -> Initialize devices -> begin trial -> event occurred -> end trial

Check settings

- Video settings
- Arduino settings
- Device locations
- Data save locations

Initialize devices

- Connect & init arduino
- Connect & init media devices
- Start filestreams for data saving

Begin trial

- Send go signal to arduino and devices
- Start recording from video device
- Begin taking in data into files
- Display events as they occur

End trial

- Save files
- Save video
- Disconnect and cleanup devices
- Add into database
