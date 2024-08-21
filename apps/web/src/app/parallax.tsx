'use client';

import Script from 'next/script';
import React, { useEffect, useRef } from 'react';

function Parallax() {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      const parallaxLayers =
        // @ts-ignore - umm temperorially ignore this error
        containerRef?.current.querySelectorAll('.parallax-layer');

      parallaxLayers.forEach((layer: HTMLElement) => {
        const depth = layer.getAttribute('data-depth');
        if (!depth) return;
        const movement = scrollTop * parseFloat(depth);
        layer.style.transform = `translate3d(0, ${movement}px, 0)`;
      });
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div ref={containerRef}>
      <img
        src={'/landing_images/layer1.png'}
        alt="sunhacks"
        className="w-full h-full absolute z-10 parallax-layer"
        data-depth="0.1"
      />
      <img
        src={'/landing_images/layer2.png'}
        alt="sunhacks"
        className="w-full h-full absolute z-[9] parallax-layer"
        data-depth="0.2"
      />
      <img
        src={'/landing_images/layer3.png'}
        alt="sunhacks"
        className="w-full h-full absolute z-[8] parallax-layer"
        data-depth="0.3"
      />
      <img
        src={'/landing_images/layer4.png'}
        alt="sunhacks"
        className="w-full h-full absolute z-[7] parallax-layer"
        data-depth="0.4"
      />
      <img
        src={'/landing_images/layer5.png'}
        alt="sunhacks"
        className="w-full h-full absolute z-[6] parallax-layer"
        data-depth="0.5"
      />
      <img
        src={'/landing_images/layer6.png'}
        alt="sunhacks"
        className="w-full h-full absolute z-[5] parallax-layer"
        data-depth="0.8"
      />
    </div>
  );
}

export default Parallax;
