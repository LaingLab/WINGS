# Todo file for stuff I gta do

1. Learn Git and Github lmao this is silly

2. Setup USB arduino controller (Johnny-five)

   - [x] Connects to arduino
   - [x] Sets up various sensors
   - [x] triggers events based on sensor input
   - [x] outputs sensor readings to frontend

3. Setup bluetooth controller (Electron Web Bluetooth API)

   - [ ] Connects to nrf52832
   - [ ] Sends either 1 or 0 to the device based on user input
   - [ ] Records and outputs current state of the device
   - [ ] Records and outputs when device state changes

4. Setup video recording (Electron Web HID API)

   - [ ] Connects to camera
   - [ ] Records video
   - [ ] Outputs video to frontend
   - [ ] Saves video to disk

5. Setup trial saving and logging (Unknown)

   - [ ] Starts trial
   - [ ] Enables usb controller
   - [ ] Enables bluetooth controller
   - [ ] Enables video recording
   - [ ] Commences trial for x amount of time or until trial is ended
   - [ ] Logs all backend output/logs/data to a file and to frontend
   - [ ] Disables usb controller
   - [ ] Disables bluetooth controller
   - [ ] Disables video recording
   - [ ] Ends trial
   - [ ] Saves trial data to disk

6. Setup trial loading and playback (Frontend-heavy)

   - [ ] Pick and load trial
   - [ ] Play through trial, pause, slow down, speed up, etc.
   - [ ] Output trial data to frontend
   - [ ] Ability to view sensor readings and device state changes in different formats
     - [ ] Graphs
     - [ ] Tables
     - [ ] etc.
   - [ ] Multi-tiled view for custom viewing formats
   - [ ] Export/import trial data to json/csv/etc. formats
