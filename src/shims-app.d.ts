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
