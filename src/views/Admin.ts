import { Component, Vue } from "vue-property-decorator";
import { CreateElement } from 'vue';

@Component({
  name: "Admin"
})
export default class Admin extends Vue {
  render(h: CreateElement) {
    return h('RouterView')
  }
}
