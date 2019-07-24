import { Component, Vue } from "vue-property-decorator";
import { CreateElement } from 'vue';

@Component({
  name: "Voter"
})
export default class Voter extends Vue {
  render(h: CreateElement) {
    return h('RouterView')
  }
}
