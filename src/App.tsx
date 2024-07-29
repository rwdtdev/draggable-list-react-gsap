import { useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ListItem from "./listItem.tsx";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);
gsap.registerPlugin(useGSAP);
function App() {
  const [data, setData] = useState([
    { id: "g0", data: "..0" },
    { id: "g1", data: ".......1" },
    { id: "g2", data: "............2" },
    { id: "g3", data: ".................3" },
    { id: "g4", data: "......................4" },
    { id: "g5", data: "...........................5" },
    { id: "g6", data: "................................6" },
  ]);
  const container = useRef<HTMLUListElement | null>(null);
  useGSAP(
    () => {
      const elements = document.querySelectorAll(".listitem");
      Draggable.create(elements, {
        type: "y",
        // bounds: container.current,
        // y: 0,

        startIndex: undefined,
        crossIndex: undefined,

        onPress: function () {
          // this.y = this.startY;
          console.log(this, this.target, this.vars.skipRows, this.target.id);
          this.vars.skipRows = 0;
          elements.forEach((item, i) => {
            if (item.id === this.target.id) {
              console.log(i);
              this.vars.startIndex = i;
            }
          });
        },

        onDrag: function () {
          elements.forEach((el, i) => {
            if (this.hitTest(el, "50%")) {
              this.vars.crossIndex = i;
              if (this.y > 0 && this.deltaY > 0) {
                console.log(">>");
                gsap.to(el, { y: -Number(el.offsetHeight) });
              } else if (this.y > 0 && this.deltaY < 0) {
                console.log("><");
                gsap.to(el, { y: 0 });
              } else if (this.y < 0 && this.deltaY < 0) {
                console.log("<<");
                gsap.to(el, { y: +Number(el.offsetHeight) });
              } else if (this.y < 0 && this.deltaY > 0) {
                console.log("<>");
                gsap.to(el, { y: 0 });
                // }
              }
            }
          });
        },
        onDragEnd: function () {
          console.log("this.skipRows:", this.vars.skipRows, elements);
          // elements.forEach((item) => console.log(item.innerHTML));
          gsap.to(this.target, {
            x: 0,
            y:
              (this.vars.crossIndex - this.vars.startIndex) *
              this.target.offsetHeight,
          });
          this.vars.startIndex = undefined;
          this.vars.crossIndex = undefined;
        },
      });
    },
    { scope: container }
  );
  return (
    <>
      <h1>List</h1>
      <ul ref={container} className="gsap-container">
        {data.map((item) => (
          <ListItem item={item} container={container} key={item.id} />
        ))}
      </ul>
    </>
  );
}

export default App;
