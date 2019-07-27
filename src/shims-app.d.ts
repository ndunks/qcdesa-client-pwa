import { Api } from "./app/api";

/**
 * Preloading controller
 * * Increase counter to display loading bar on top
 * * Decrease counter to hide
 * 
 * This is defined in file://../public/index.html
 */
interface AppLoading {

  /**
   * HTML Preloading Element
   */
  el: HTMLDivElement

  /**
   * if counter > 0, then loading bar will be displayed
   */
  counter: number

  /**
   * Get visibility state
   */
  readonly visible: boolean
}

declare global {
  /**
   * Access loading object every where
   */
  const loading: AppLoading

  /**
  * Access Api every where
  */
  const $api: Api
  type VoteStatus = 'Selesai' | 'Belum Dimulai' | 'Dihitung'
  type VoteStatusObj<T = any> = { [status in VoteStatus]: T }
  interface VoteCandidate {
    name: string
    number: string
    image?: string
  }
  interface VoteLocation {
    name: string
    participant: number
  }

  interface Vote {
    name: string
    desc: string
    hide?: boolean
    candidates: VoteCandidate[]
    locations: VoteLocation[]
  }
  interface VoteResultRaw<T = number> {
    started: number
    finished?: number
    accepted: number
    declined: number
    total: number
    results: T[]
    updated: number
  }

  interface VoteResult<T extends any> extends VoteResultRaw<T> {
    status: VoteStatus
    sortedResults: T[]
  }
  /* 
  interface VoteSummaryResult<T extends any = number> {
    result: VoteResult
    results: Array<VoteCandidate & VoteReactive>
    sortedResults: Array<VoteCandidate & VoteReactive>
  }
 */
  interface VoteReactive {
    count: number
    pos: number
    move: string
    moveColor: string
  }

  interface Window {
    loading: AppLoading
    $api: Api
  }
}

declare module 'vue/types/vue' {

  interface Vue {
    $api: Api
  }

  interface VueConstructor<V extends Vue = Vue> {
    use(plugin: typeof Api, options: { [field in keyof Api]?: any })
  }
}
