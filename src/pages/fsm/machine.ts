import { walk } from 'estree-walker'
import { createMachine } from 'xstate'

export const promiseMachine
/** @xstate-layout N4IgpgJg5mDOIC5SG0Ew604DoDuBDAlgF1wDsoBiAGzGwDcwAJAewFswBtABgF1FQAHB2AVwMiPEAA9EARgCcU9AA4A7AFZ2AZiXqp6gEz6ZKgDQgAntPUA2dCtkylUrQsv2ALCoC+Hk2ix5CJKQATmAAjgCucPgAYgwMEBzcSCD8goQiYpIISkoK6OyWuq5SxXKurg4m5ggK8rYyDSqW6sW5rpZePhgiAOrY5ADWpAwDiWKpQhnJWTLsSugymu5Sau1KVYhKrnnsuuy7qjkH6p0gvr39A+jYAMaE1LhwfoPEZLC8YJAAqrxjyRPpUTTRC6WzoPb7OYyYq6QoqBQbbLsFToI67bblBQVE7eM7dIh9QbXO64B5PHAvQKwfAMX5ccYCSZA0BZUHyCH7JTQqSw0EIsyIFSafIQywFBQKcVKU7nAmXYn3R6wdBBcJEIivUjvT4QAAiDEwRD+fEZgMyILBHKhMLh-OqlhUKNhDS2Dm2KwUMvxhKut0VT1V6s1sHCEAgYCIAGUaXSkia0sJmRJBUVUTy1JoFEVdJUBUi8jn9pYpAoVEoxepPLjZT6FaSlehYBqAGZaj7fWMMhNTFmCyU2HmuGSWHIqVzqdSIrPWFQQoezGTOXQyL3oC5Ev31p5N3CtkNhiOR9sQH7GlKmxPmhCz1xp0EaXLZ3P2suopT7UuqdTsLFVrpruUiXwPByGVIgGHwPooCgTUcGg15o2wIJ8DPAFL2BBBYXUBY1A-H8uVcH9ESkB8RXYEtXGXLR3xXatvXlYDcFAvx4MCOCYJIaNaVQi8e2TTDLGsIoGkXWcJ0lSc80XGc9h0YoRwnRYvFxcDw3gZI0C7JkrwAWhzREdJRRdIRM0zXFXHAhBILSzQw18J1UKRHGElR7HYVxiOFciXUcdRnDcP88QAn0bPQ3tMKkRErF0MjdhLSxlF0ZRApreVNzJdT420jCXERcoZBsCFHQaYstAdVd119EkMueAZXlCvisic9Y83fbDKP2WQFG0LFKIqwCqv9ZVAw1az-l4pMskI9gBxcrEnMsdpjFa-Z0AShT7wSjN+trdKGx3ZsGsmzYktRJZS3I8toUk6pana992GhR6eWaFL6KAkDMvPbtjoQXK8wUBoyJI-Z1EXaFzLo4KGM+9BwMg7BWKgI6r2axEGhiisKnhR0R09KHKvQRjmPY+rxp+q9KJRbHdisFwSkMZbqkadASMrWFZG-WFIf-CkBgAYWYXhKHwMAUYwho8kWLZHU0GRl2cRFXXBB61DHHlJVorwgA */
= createMachine({
  id: '遛狗',
  initial: 'waiting',
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
      },
    },
    walkComplete: {
      type: 'final',
      entry: ['closeDoor', 'haveDinner'],
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
