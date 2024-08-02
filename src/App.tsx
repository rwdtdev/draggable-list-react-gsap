import { useEffect, useRef, useState } from "react";
import "./App.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import { nanoid } from "nanoid";

type Sortable = {
  dragger: Draggable;
  element: Element;
  index: number;
  setIndex: (index: number) => void;
};

gsap.registerPlugin(Draggable);
gsap.registerPlugin(useGSAP);
let container: Element | undefined = undefined;
function App() {
  const [data, setData] = useState([
    "1 Alfa",
    "2 Bravo",
    "3 Charlie",
    "4 Delta",
  ]);

  const actionType = useRef<"addItem" | "delItem" | "firstRender" | null>(
    "firstRender"
  );

  const refItems = useRef<HTMLLIElement[]>([]);

  useEffect(() => {
    container = document.querySelector(".g-container")!;
  }, []);
  useGSAP(
    () => {
      const rowSize = 100; // => container height / number of items
      const listItems = Array.from(document.querySelectorAll(".g-list-item")); // Array of elements
      // const listItems = refItems.current; // Array of elements
      console.log("🚀 ~ App ~ listItems:", listItems);
      const sortables = listItems.map(Sortable); // Array of sortables
      const total = sortables.length;
      const dataClone = structuredClone(data);
      console.log(
        "useGSAP:",
        actionType.current,
        "sortables.length:",
        sortables.length,
        dataClone
      );
      // if (container) gsap.to(container, { autoAlpha: 1 });

      function changeIndex(item: Sortable, to: number) {
        // Change position in array
        sortables.splice(to, 0, sortables.splice(item.index, 1)[0]);

        // Change element's position in DOM. Not always necessary. Just showing how.
        dataClone.splice(to, 0, dataClone.splice(item.index, 1)[0]);
        // if (to === total - 1) {
        //   container!.appendChild(item.element);
        // } else {
        //   const i = item.index > to ? to : to + 1;
        //   container!.insertBefore(item.element, container!.children[i]);
        // }

        // Set index for each sortable
        sortables.forEach((sortable, index) => sortable.setIndex(index));
      }

      function Sortable(element: Element, index: number) {
        const content = element.querySelector(".item-content");
        // const order = element.querySelector(".order");

        const animation = gsap.to(content, {
          boxShadow: "rgba(0,0,0,0.2) 0px 16px 32px 0px",
          force3D: true,
          scale: 1.1,
          paused: true,
          delay: 0.1,
        });

        const dragger = new Draggable(element, {
          onPress: () => {
            animation.play();
          },

          onDrag: onDragFunc,
          onRelease: () => {
            if (actionType.current !== "delItem") {
              animation.reverse();
              gsap.to(element, { y: sortable.index * rowSize });
              setData(dataClone);
              container = document.querySelector(".g-container")!;
            }
          },
          cursor: "inherit",
          type: "y",
        });

        // Public properties and methods
        const sortable = {
          dragger: dragger,
          element: element,
          index: index,
          setIndex: setIndex,
        };

        if (actionType.current === "addItem") {
          const fromIndex = index === data.length - 1 ? index - 1 : index;

          const tl = gsap.timeline();
          tl.set(element, { zIndex: -index })
            .fromTo(
              element,
              { y: fromIndex * rowSize },
              {
                y: index * rowSize,
                duration: 1,
              }
            )
            .set(element, { zIndex: 0 });
        } else if (actionType.current === "firstRender") {
          gsap.set(element, { y: index * rowSize });
        } else {
          gsap.to(element, { y: index * rowSize });
        }

        function setIndex(index: number) {
          sortable.index = index;
          // order!.textContent = String(index + 1);

          // Don't layout if you're dragging
          if (!dragger.isDragging) {
            gsap.to(element, { y: sortable.index * rowSize });
          }
        }

        function onDragFunc() {
          // Calculate the current index based on element's position
          const index = clamp(Math.round(this.y / rowSize), 0, total - 1);

          if (index !== sortable.index) {
            changeIndex(sortable, index);
          }
        }

        return sortable;
      }

      // Clamps a value to a min/max
      function clamp(value: number, a: number, b: number) {
        return value < a ? a : value > b ? b : value;
      }
      actionType.current = null;
    },
    { scope: container, dependencies: [data] }
  );
  return (
    <>
      <h1>List</h1>
      <ul className="g-container">
        {data.map((item, i) => (
          <li
            className="g-list-item"
            key={item}
            ref={(el) => (refItems.current[i] = el!)}
          >
            <div className="item-content">
              <span
                onClick={() => {
                  setData((st) => st.filter((it) => it !== item));
                  actionType.current = "delItem";
                  // refItems.current.splice(i, 1);
                }}
              >
                del
              </span>{" "}
              {item}
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={() => {
          setData((st) => [...st, nanoid()]);
          actionType.current = "addItem";
        }}
      >
        s add item
      </button>
    </>
  );
}

export default App;
