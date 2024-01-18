import { useCustomMediaQuery } from '~/hooks/common';
import { SearchBoxDesktop } from './SearchBoxDesktop';

export function SearchBox() {
  const mdUp = useCustomMediaQuery('up', 'md');

  return mdUp ? <SearchBoxDesktop /> : <></>;
}
