export function useKeyUp(key: string, callback: () => void) {
  return (e: any) => {
    if (e.key === key) {
      callback();
    }
  };
}
