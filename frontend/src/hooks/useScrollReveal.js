import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function useScrollReveal(options = { once: true, amount: 0.2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, options);

  return { ref, isInView };
}
