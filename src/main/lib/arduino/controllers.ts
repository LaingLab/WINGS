import five from 'johnny-five'

export class PumpController {
  ena: five.Pin
  int1: five.Pin
  int2: five.Pin

  constructor(enaPin, int1Pin, int2Pin) {
    this.ena = new five.Pin({ pin: enaPin })
    this.int1 = new five.Pin({ pin: int1Pin })
    this.int2 = new five.Pin({ pin: int2Pin })
  }

  start(speed) {
    this.int1.high()
    this.int2.low()
    this.ena.write(speed ?? 25) // 0-255
  }

  stop() {
    this.ena.write(0)
    this.int1.low()
    this.int2.low()
  }

  reverse(speed = 255) {
    this.int1.low()
    this.int2.high()
    this.ena.write(speed)
  }
}
