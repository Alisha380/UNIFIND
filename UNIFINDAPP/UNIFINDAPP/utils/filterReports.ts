type Report = {
  item_name?: string | null;
  location?: string | null;
  type: string;
};

export const filterReports = <T extends Report>(
  items: T[],
  searchQuery: string,
  activeFilter: string
): T[] => {
  const query = searchQuery.toLowerCase();

  return items.filter(item => {
    const name = item.item_name?.toLowerCase() || '';
    const location = item.location?.toLowerCase() || '';

    const matchSearch =
      name.includes(query) || location.includes(query);

    const matchFilter =
      activeFilter === 'All' || item.type === activeFilter;

    return matchSearch && matchFilter;
  });
};