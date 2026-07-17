import { useLayoutEffect, useState, RefObject } from "react";

export function findPosition(
  containerRef: RefObject<HTMLDivElement>,
  imageRef: RefObject<HTMLImageElement>,
  item: { x: number; y: number },
  zIndex: number,
) {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useLayoutEffect(() => {
    const img = imageRef.current;
    const el = containerRef.current;
    if (!img || !el) return;

    const calculate = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      if (!ratio) return;

      const { width: cw, height: ch } = el.getBoundingClientRect();
      const containerRatio = cw / ch;

      let imgW: number, imgH: number, offsetX: number, offsetY: number;
      if (containerRatio > ratio) {
        imgH = ch;
        imgW = ch * ratio;
        offsetX = (cw - imgW) / 2;
        offsetY = 0;
      } else {
        imgW = cw;
        imgH = cw / ratio;
        offsetX = 0;
        offsetY = (ch - imgH) / 2;
      }

      setStyle({
        position: "absolute" as const,
        left: offsetX + imgW * item.x,
        top: offsetY + imgH * item.y,
        transform: "translate(-50%, -100%)",
        zIndex: zIndex,
      });
    };

    if (img.complete) {
      calculate();
    } else {
      img.addEventListener("load", calculate);
    }

    const observer = new ResizeObserver(calculate);
    observer.observe(el);

    return () => {
      img.removeEventListener("load", calculate);
      observer.disconnect();
    };
  }, [containerRef]);

  return style;
}
