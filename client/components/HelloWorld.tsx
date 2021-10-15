import { ref, defineComponent, VNode } from 'vue';
import './HelloWorld.scss';

const count = ref(0);

const Props = {
  msg: { type: String, default: '' },
};

const testCreateNode = (buttonNode: VNode) => (
  <>
    <p>
      Recommended IDE setup:
      <a href="https://code.visualstudio.com/" target="_blank">
        VSCode
      </a>
      +
      <a href="https://github.com/johnsoncodehk/volar" target="_blank">
        Volar
      </a>
    </p>

    <p>
      See <code>README.md</code> for more information.
    </p>

    <p>
      <a href="https://vitejs.dev/guide/features.html" target="_blank">
        Vite Docs
      </a>
      |
      <a href="https://v3.vuejs.org/" target="_blank">
        Vue 3 Docs
      </a>
    </p>

    {buttonNode}
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test hot module replacement.
    </p>
  </>
);

const onClick = () => {
  console.log('触发');
  count.value++;
};

const ButtonNode = (onclick: typeof onClick) => (
  <button type="button" onClick={onclick}>
    count is: {count.value}
  </button>
);

export const HelloWorld = defineComponent({
  name: 'App',
  props: Props,
  setup(prop) {
    const Returns = () => (
      <>
        <h1>{prop.msg}</h1>
        {testCreateNode(ButtonNode(onClick))}
      </>
    );

    return Returns;
  },
});
