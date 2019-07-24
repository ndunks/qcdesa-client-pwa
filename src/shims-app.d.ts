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
    interface Window {
        loading: AppLoading
    }
}
export {}