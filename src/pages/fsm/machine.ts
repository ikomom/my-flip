import { actions, createMachine } from 'xstate'

console.log('#cancel', actions.cancel('ddd'))

export const promiseMachine
/** @xstate-layout N4IgpgJg5mDOIC5SG0Ew604DoDuBDAlgF1wDsoBiAGzGwDcwAJAewFswBtABgF1FQAHB2AVwMiPEAA9EARgCcU9AA4A7AFZ2UgGxKZ7JUoBM+gCwAaEAE9EKgMwb0SozJlb9KlUf0aZAX29m0WHiEJKQATmAAjgCucPgAYgwMEBzcSCD8goQiYpIIUvrW6OzWDjL6SlIqMipSFWaWCEYK8qXV2goy1prW1r7+GCIA6tjkANakDKMpYhlC2Wm5UlIKdgquy1WV7jIK9Va29o7OBm4eXn0gAUMjo+jYAMaE1LhwgWPEZLC8YJAAqrzTNKzLKiBZWIzsIrKRxKDTqWyVPYIKoyexqdjqHTWdjGIwXK5EYZjO6PXDPV44d4hWD4BgArgzARzUGgXLuSHsaEyWHwjSIiyIIxdIoYjHLDQrGpSfEDQk3ElPF6wdChKJEIgfUhfH4QAAiDEwREBfCZIJy4I5XJ5UgRKiR23Qrgx+mKGg0jgUChl6GuxIeiteqvVmtgUQgEDARAAyrT6akTZlhCyJIhmoU4RiFNZXNYFOwhUi4fpHej9M5s3DOt7fbd-WSlehYBqAGZa75-OOMxPzVmprzoCHqNzVIxVPlIgyQo5OTwVfTKFTVuV+0nk5VN3Ct0PhyNR9sQf7G9KmpPmhBp9AZznZmx5gsC5E1Q5OMoaWxyaw+PyXWVE274PByGVIgGHwYYoCgTUcAgj4Y2wUJ8CPYFTzBZEPEUEp2XUE58iRTpIRfZQOnzawVE9Jc-3QADcCAwIYJCaDIJIGM6SQk8exTNCVHQG1VDOMo9BUfQkU9KcXyEtYlGdRdvwJSjCBYAAVUJsCIbsiHQZtcFCGlSHwTAGDY9SzyEy1SmtW0kXKAiXx2FZSOMXpZN-eUFLAZTVPUxswHuEQIAmIg2AZIF2OTNkXShcy4RtPk7QfQxIXRbCKycFZfG-ECI3gNI0C7ZkzxkJEAFojHkWzyvK70cCEEg8rNVCVCUdAelUHFdBUCVqntEpHSOT8hLIjxpWcn1l1GOqUN7BAy1RT0HAURw+WcNYkVHdAkrFIwlBvGwKPlOs1wmjjcmsLbFGhBbnFkCVhIfU7Cg2lENDInYnP6UbKIOhtKVGD4jrCxB+vO+bFuulaHyMNb81SoSSj0Rw3p-D79tXBsgw1WqQuM1DOoHUVZCGnp+QaNwmqzHo1A0QwyLfPaVwDdcW3+s8pAxJqqZqbbyli577TcHj8YUUzKhtOn-0A7KE3y1DTrJi7QeW26Gm0YtbIcF0lDTfQxaoiX0BAsDsHoqBmZl6pgaaBWbpElZ1qzAoJS0JYOp16jaMYv6selqapKMZqObvapcTihpPVRa8HZWCpKg0V3cCUlS1O949sam2WLcupbrYfG1ClFTMFs56pY5GmsqPj9zE68rSdPwU20-NubLauxWrM8O2ek-dg1B0WnS7G8uE885lvN8ogIHrzi+XkTkHAqIUjDdDw2-D8mu579g+-en6AGFmF4Sh8DASe2SUJF8iEgcX0qHQMXcdLvCAA */
= createMachine({
  id: '遛狗',
  initial: 'waiting',
  context: {
    master: 'ikonon',
    dog: 'miao',
  },
  states: {
    waiting: {
      on: {
        leaveHome: { target: 'onWalk' },
        requestFood: {
        },
      },
    },
    onWalk: {
      type: 'parallel',
      on: {
        ok: { target: 'walkComplete' },
      },
      states: {
        activies: {
          initial: 'walking',
          states: {
            walking: {
              on: {
                speedUp: { target: 'running' },
                stop: {
                  target: 'snif',
                },
              },
              after: [
                {
                  delay: (context, event) => {
                    console.log('#delay', { context, event })
                    return 2000
                  },
                  target: 'running',
                },
              ],
            },

            running: {
              on: {
                speedDown: { target: 'walking' },
                suddenStop: {
                  target: 'snif',
                },
              },
            },

            snif: {
              on: {
                speedUp: { target: 'walking' },
                suddenSpeedUp: { target: 'running' },
              },

            },
          },
        },
        tails: {
          initial: 'notWagging',
          states: {
            notWagging: {
              on: {
                waggingStart: { target: 'wagging' },
              },
            },
            wagging: {
              on: {
                waggingStop: {
                  target: 'notWagging',
                },
              },
            },
          },
        },
        timeTransition: {
          initial: 'first',
          states: {
            first: {
              on: {
                two: { target: 'second' },
              },
            },
            second: {
              on: {
                one: {
                  target: 'first',
                },
              },
            },
          },
        },
      },
    },
    walkComplete: {
      type: 'final',
      entry: ['closeDoor', 'haveDinner'],
    },
  },
}, {
  actions: {
    closeDoor: (context, event) => {
      alert('closeDoor!')
    },
  },
})

const fileMachine
/** @xstate-layout N4IgpgJg5mDOIC5QDMCWAbMA6ArgB3QHsBDCLVCTAYgEkA5GgFQH0BVABQBkB5AQQBEA2gAYAuolB5CsVABdUhAHYSQAD0QBGAJwasAJmGGNAFgAcAdlMA2U1uF6ANCACemgKy7DX4VaNWPbgC+gU5omLgEJGR4YIoQqIpQVBw8AswAwtwAslwAooy5IuJIIFIy8koq6gjGVlpY5npuwmYAzHq+lv5OrggaHljehr7CGv79waEY2BCEAO6KRKTklGC0DCz83ADqdKlCYiplcgrKJdXaugZGZl229j2IrRqe3k3GWnqmBsaTIGEzeaLKJYGJxBJJLa7fYZbJ5ApFI7SE6Vc6ID6mQYWNytYQ6VqmVrGEyPBDPV5ed6fb4tYIhECKQgQOAqAFI8qnKqIAC0emMpN5xkGQxFhnMfwBESWEHZKLOoGqfNJVlaWGa3lxhm+bnF9Ml+GlK0wsoq8rUiEapP6unVhj0enMtTcQT10ylILB8USJs5aLJzTVTWErSJxnMBK0VitA1twz8AQlboNINgOAAxmm4PASsdTVyEDY9FgbOY3MYfI0dXVozahiMxh5E+FZgtpT7UQrEEqXF29KrY-aPtotGGm4DWyCKMac8i837LT2yS81d5jPbWuZzNox1gW8Dlp6Ie2zdUN5jTNixsGPMYAqTySvKWXqT8d3vDamM1nj-nw+egyYa51I6Wj3suA7Pl8eh0oEQA */
= createMachine({
  id: 'file',
  type: 'parallel',
  states: {
    upload: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            INIT_UPLOAD: { target: 'pending' },
          },
        },
        pending: {
          on: {
            UPLOAD_COMPLETE: { target: 'success' },
          },
        },
        success: {},
      },
    },
    download: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            INIT_DOWNLOAD: { target: 'pending' },
          },
        },
        pending: {
          on: {
            DOWNLOAD_COMPLETE: { target: 'success' },
          },
        },
        success: {},
      },
    },
  },
})
