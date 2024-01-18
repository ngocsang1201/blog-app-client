import { useEffect, useRef, useState } from 'react';

export function useMouseEventsWithPopup() {
  const [open, setOpen] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return onMouseLeave;
  }, []);

  const onMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(true);
    }, 500);
  };

  const onMouseLeave = () => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
    setOpen(false);
  };

  return { open, mouseEvents: { onMouseEnter, onMouseLeave } };
}
