import { DiscoveredItem } from '../../../types/portfolio';

export interface GapSectionProps<T = any> {
  item: DiscoveredItem;
  data: T | undefined;
  onChange: (data: T) => void;
  onAddComment?: (fieldPath: string) => void;
}

export interface GapSectionConfig {
  key: string;
  label: string;
  icon: string;
  description: string;
  required: boolean;
  /** Optional visibility predicate — when provided, the tab only renders if this returns true for the current item. */
  showWhen?: (item: DiscoveredItem) => boolean;
}
