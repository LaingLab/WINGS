# Use to plan

## Plan

- [x] Scaffold ui with mock data
- [x] Setup jotai for state management
- [x] Event listeners (jotai)
- [x] IPC communcation to and from backend
- [x] Save trial data into logs and files
- [x] Persistant user data
- [x] Data loading on app start
- [x] OS compatible file system
- [x] Backend trial runtime
- [x] Implement trial runtime into ui
- [x] Video file saving + conversion
- [x] Refactor arduino backend code to be more modular
- [x] Arduino pin editor (UI - key value store)
- [x] Setup pump/atomizer device
- [x] Basic Pin Debug View
- [x] Basic Results View
- [x] Improve Logging
- [x] Adjust models for better data handling (new branch)
- [x] Arduino Delay
- [x] Remove priming/unpriming - make local to pin
- [x] Load result page based on params
- [x] Modals
- [ ] Video saving/loading w/audio
- [ ] Switch activation buttons
- [ ] Arduino selector
- [ ] Fix debug page

## Notes

- Make pump pins discrete
- Frontend btn unprime state

## Other Stuff

### Yap Area

So basically I need to make an app that can run a trial.
I need this app to be able to basically run a trial from start to finish

But how should I structure my trial data?

Now I have a solid plan for the basic flow of data for this app
What could I do next?

1. Make step by step plan for dev
2. Continue to flesh out the backend/types
3. Make figma chart for data flow

I think the chart would be helpful in the long run, but may hinder my dev
process atm, I think I should probably start making a step by step plan
editing the backend info and types on the way.

Since I already have the backend functionality made, I should scaffold the ui
first, since it is the main point of contention now. This doesn't mean to try
too hard.

### Trial Stuff

Setup -> Idle -> Started -> Initializing -> Executing -> Saving -> Exiting -> Idle

#### Setup

- Choose Arduino
- Choose Video Device
- Set Trial Parameters
- After -> set status to idle

#### Executing

- Log all data/events
- Record Video
- Show sensor readings

#### Saving

- Save recording to file
- Save all data/events to flat files
  - Pass recording data in
- Add trial into db

#### Exiting

- Cleaning up device exits
- Reload data

### Trial Data

- Name
- Status
- ArduinoInfo
  - Device Path
  - Pin Info
  - Connection Info?
  - Parameters
- VideoInfo
  - Device Path
  - Output Path
  - Filename
  - Parameters
- Data
  - Events
    - Name
    - Type
    - Time
    - Parameters
  - Logs
    - Flat txt file -- "[Time] <file> (func) Log"
  - Sensor Readings
- Settings

### Trial Runtime

1. Start trial called
2. Initialize devices
3. Start recording
4. Event loop
5. Save data and logs
