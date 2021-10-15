import { HelloWorld } from "./components/HelloWorld";
import { defineComponent } from "vue";
import logo from "./assets/logo.png";
import "./App.scss";

interface InputProps {
  value: string;
  onChange: (value: MouseEvent) => void;
}

export default defineComponent<InputProps>({
  setup(props) {
    const handleChange = (event: MouseEvent) => {
      // props.onChange
      props.onChange(event);
    };

    return () => (
      <>
        <img onClick={handleChange} alt="Vue logo" src={logo} />
        <HelloWorld msg="Hello Vue 3 + TypeScript + Vite Apps" />
      </>
    );
  },
});
