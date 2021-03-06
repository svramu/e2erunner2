import { TRACE } from "./consts"
import { removeItemOnce } from "./lib"

export class IFmgr {
  private readonly _events: string[] = []
  private readonly _ifstack: string[] = []
  private _ok: boolean = true

  handleEvent(event: string, lineno: number) {
    this._events.push(event)
    if (TRACE)
      console.log(lineno, 'event:: ', this._events, event)

  }
  handleIf(cond: string, lineno: number) {
    // Handling just boolean-not expression now, rest can wait. 
    const not = cond.startsWith('!')
    const event = not ? cond.slice(1) : cond
    const condition = !not && this._events.includes(event) || not && !this._events.includes(event)
    if (condition) {
      this._ifstack.push(cond)
      this._ok = true
    } else {
      this._ok = false
    }
    if (TRACE)
      console.log(lineno, 'if:: ', this._events, event)
  }
  handleEndIf(events: string, lineno: number) {
    this._ifstack.pop()
    let events_clean: string[] = []
    if (!!events) {
      events_clean = events.split(',').map(e => e.trim())
      events_clean.forEach(ev => removeItemOnce(this._events, ev))
    }

    this._ok = true
    if (TRACE)
      console.log(lineno, 'endif:: ', this._events, events_clean)
  }

  get ok() {
    return this._ok
  }
}

// -----------------------------------------------------------------------------

// if (require.main !== module) process.exit()

// const ifmgr = new IFmgr()

// ifmgr.handleEvent('miss')
// ifmgr.handleIf('hiss')
// ifmgr.ok
// ifmgr.handleIf('miss')
// ifmgr.ok
// ifmgr.handleEndIf()
