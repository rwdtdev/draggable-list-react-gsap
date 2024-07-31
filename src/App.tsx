import { useEffect, useRef, useState } from "react";
import "./App.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";

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
  useEffect(() => {
    container = document.querySelector(".g-container")!;
  }, []);
  useGSAP(
    () => {
      const rowSize = 100; // => container height / number of items
      const listItems = Array.from(document.querySelectorAll(".g-list-item")); // Array of elements
      const sortables = listItems.map(Sortable); // Array of sortables
      const total = sortables.length;

      // if (container) gsap.to(container, { autoAlpha: 1 });

      function changeIndex(item: Sortable, to: number) {
        // Change position in array
        arrayMove(sortables, item.index, to);

        // Change element's position in DOM. Not always necessary. Just showing how.
        if (to === total - 1) {
          container!.appendChild(item.element);
        } else {
          const i = item.index > to ? to : to + 1;
          container!.insertBefore(item.element, container!.children[i]);
        }

        // Set index for each sortable
        sortables.forEach((sortable, index) => sortable.setIndex(index));
      }

      function Sortable(element: Element, index: number) {
        const content = element.querySelector(".item-content");
        const order = element.querySelector(".order");

        const animation = gsap.to(content, {
          boxShadow: "rgba(0,0,0,0.2) 0px 16px 32px 0px",
          force3D: true,
          scale: 1.1,
          paused: true,
        });

        const dragger = new Draggable(element, {
          onPress: () => {
            animation.play();
          },
          // onDragStart: () => {
          //   this.update();
          // },
          onDrag: onDragFunc,
          onRelease: () => {
            animation.reverse();
            gsap.to(element, { y: sortable.index * rowSize });
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

        gsap.set(element, { y: index * rowSize });

        function setIndex(index: number) {
          sortable.index = index;
          order!.textContent = String(index + 1);

          // Don't layout if you're dragging
          if (!dragger.isDragging) layout();
        }

        // function onDragStartFunc() {
        //   // animation.play();
        //   this.update();
        // }

        function onDragFunc() {
          // Calculate the current index based on element's position
          const index = clamp(Math.round(this.y / rowSize), 0, total - 1);

          if (index !== sortable.index) {
            changeIndex(sortable, index);
          }
        }

        // function onReleaseFunc() {
        //   animation.reverse();
        //   layout();
        // }

        function layout() {
          gsap.to(element, { y: sortable.index * rowSize });
        }

        return sortable;
      }

      // Changes an elements's position in array
      function arrayMove(array: Array<Sortable>, from: number, to: number) {
        array.splice(to, 0, array.splice(from, 1)[0]);
      }

      // Clamps a value to a min/max
      function clamp(value: number, a: number, b: number) {
        return value < a ? a : value > b ? b : value;
      }
    },
    { scope: container }
  );
  return (
    <>
      <h1>List</h1>
      <section className="g-container">
        <div className="g-list-item">
          <div className="item-content">
            <span className="order">1</span> Alpha
          </div>
        </div>

        <div className="g-list-item">
          <div className="item-content">
            <span className="order">2</span> Bravo
          </div>
        </div>

        <div className="g-list-item">
          <div className="item-content">
            <span className="order">3</span> Charlie
          </div>
        </div>

        <div className="g-list-item">
          <div className="item-content">
            <span className="order">4</span> Delta
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
