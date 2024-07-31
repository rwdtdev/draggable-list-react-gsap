import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);
gsap.registerPlugin(useGSAP);

type Props = {
  item: { id: string; data: string };
  container: React.MutableRefObject<HTMLUListElement | null>;
};

export default function ListItem({ item, container }: Props) {
  return (
    <li
      id={item.id}
      className={`listitem border ${item.id} h-10 mb-2 bg-white z-0`}
    >
      {item.data}
    </li>
  );
}
