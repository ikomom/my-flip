import { actions, assign, createMachine } from 'xstate'

console.log('#cancel', actions.cancel('ddd'))

export const promiseMachine
/** @xstate-layout N4IgpgJg5mDOIC5SG0Ew604DoDuBDAlgF1wDsoBiAGzGwDcwAJAewFswBtABgF1FQAHB2AVwMiPEAA9EARgCcU9AA4A7AFZ2UgGxKZ7JUoBM+gCwAaEAE9EKgMwb0SozJlb9KlUf0aZAX29m0WHiEJKQATmAAjgCucPgAYgwMEBzcSCD8goQiYpIIUvrW6OzWDjL6SlIqMipSFWaWCEYK8qXV2goy1prW1r7+GCIA6tjkANakDKMpYhlC2Wm5UlIKdgquy1WV7jIK9Va29o7OBm4eXn0gAUMjo+jYAMaE1LhwgWPEZLC8YJAAqrzTNKzLKiBZWIzsIrKRxKDTqWyVPYIKoyexqdjqHTWdjGIwXK5EYZjO6PXDPV44d4hWD4BgArgzARzUGgXLuSHsaEyWHwjSIiyIIxdIoYjHLDQrGpSfEDQk3ElPF6wdChKJEIgfUhfH4QAAiDEwREBfCZIJy4I5XJ5UgRKiR23Qrgx+mKGg0jgUChl6GuxIeiteqvVmtgUQgEDARAAyrT6akTZlhCyJIglM0RZiyi64fkkRoDk72Dm1MsHN7fbd-WSlehYBqAGZa75-OOMxPzVmIFaoiHqNzVIxVPlIgyQo5OTwVfTKFTluV+0nk5V13CN0PhyNR5sQf7G9KmpPmhDNQpwjEKayuawKdhC+01Q5OMr5rw2nx+S6yom3fB4cjKogGHwYYoCgTUcFAj4Y2wUJ8D3YFDzBZEPEUEp2XUE5cwFBBOkhJ9lA6W9rBUT052-dBf1wf9AkgkIILAkgYzpeCDw7FNkJUdAbVUM4yj0FR9CRT0xyfAS1iUZ1Zw-AlyMIFgABVQmwIh2yIdB61wUIaVIfBMAYFjVKPATLVKa1bSRco8KfHYVmI4xemkr95TksBFOU1TazAe4RAgCYiDYBkgVY5M2RdKFTJzczsMMSF0Qwy8vB2DRfA-QCI3gNI0DbZkjxkJEAFojHkayZCFTkVHdTpvRwIQSGys0kJUJR0B6VQcV0CqOjtbCbGa4wnGsapXAUDxpUcn151GerEM7BB9CcRRoRG5xZAlQTsMHdA4vYapEoq1wpP6CbyKrJdprY3JrCMZrPQcZa+WcNYkSuwpx25Jx1Hm0qyPlU6a0pUYPnOkLEEGzjbqaRwHrWpEjE228nAUASSj0RwHKOisFWrQM1Q1OqgsMpCJR7UVZFGnp+QaNwbp6Yii0MEj8x+hcA2XBtgaPKQMWajR1iUS9YUqDRuqptwuNJpGXUqG1mZ-P8MoTHKkKum6lqh1anuw7R9HQaymlKkaT1lij5fQQDgOwWioA55XqkWu71ce9aGk9OwSMvWwVgqIXjco6j6KBgmldmiSjBa3mSIRgS4ZFrsOihD2JS0JYKt93AFKUlTg-3QnZpV+3IZWp2kRtQpRXhOGRtR9HP2O5z09czOPI0rT8BtvO7Yh+6NedxBDDdi8eh0NQdCZ8bMZctys5BTzvKICB2-Yvl5E5BwKiFIw3Q8Cz5oTof2BHosa4CAGAGFmF4Sh8DARe2SUEvXB18dKh0DF3BS7wgA */
= createMachine({
  id: '遛狗',
  initial: 'waiting',
  context: {
    master: 'ikonon',
    dog: 'miao',
  },
  states: {
    waiting: {
      tags: ['home', 'idle'],
      on: {
        leaveHome: { target: 'onWalk' },
        requestFood: {
          target: 'waiting',
        },
      },
    },
    onWalk: {
      type: 'parallel',
      on: {
        ok: { target: 'walkComplete' },
      },
      meta: {
        msg: '我和皮特走路',
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
              meta: {
                msg: '跑步啊啊啊',
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

interface RedditMachineContext {
  subreddit: null | string
}

const selectEvent = {
  type: 'SELECT', // event type
  name: 'reactjs', // subreddit name
}
function invokeFetchSubreddit(context: RedditMachineContext) {
  const { subreddit } = context

  return fetch(`https://www.reddit.com/r/${subreddit}.json`)
    .then(response => response.json())
    .then(json => json.data.children.map((child: { data: any }) => child.data))
}

export const redditMachine
/** @xstate-layout N4IgpgJg5mDOIC5QCdIQJYBcDEBlAogDL4DCAKgNoAMAuoqAA4D2sW6TAdvSAB6IAcAOgCco0QDZxVcfwDsAJmEBGeQBoQAT0RKArMMFSqVJeKUBmfsIAsk2QF8H6jkwhxuqCBkzdmrTOy4kXkQAWjN9I0izcLMVWSphdS0EEJ0RMWE9Cx1FcWEzRxAPL0F0CAAbMB8WNk5uPgQrNU0BJUEdSKoraSUreIK7dWKsQVgwSoBjTEhqvwD67UlBeUje2XWdfnl+fiTtbvbO-ioVpSV+HXsHOyA */
= createMachine({
  id: 'reddit',
  initial: 'idle',
  context: {
    subreddit: null,
  },
  states: {
    idle: {
      tags: 'go',
    },
    selected: {
      invoke: {
        id: 'fetch-subreddit',
        src: invokeFetchSubreddit,
      },
    },
  },
  on: {
    SELECT: {
      target: 'selected',
      actions: assign<RedditMachineContext>({
        subreddit: (ctx, evt) => evt.type,
      }),
    },
  },
})
