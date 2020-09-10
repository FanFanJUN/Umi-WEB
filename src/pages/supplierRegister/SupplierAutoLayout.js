import React, { useState, useRef, useLayoutEffect } from 'react';

function AutoSizeLayout({ children, minHeight = 200 }) {
  const layoutRef = useRef(null);
  let timeout = null;
  const [height, setHeight] = useState(minHeight);
  function getOffsetHeight() {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      const wh = document.body.clientHeight;
      const h = layoutRef.current.offsetTop;
      const lh = wh - h
      setHeight(lh)
    }, 100)
  }
  useLayoutEffect(() => {
    window.addEventListener('resize', getOffsetHeight);
    return () => window.removeEventListener('resize', getOffsetHeight);
  }, []);
  return (
    <div
      ref={layoutRef}
    >{children(height)}</div>
  )
}

export default AutoSizeLayout;