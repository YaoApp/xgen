import { SyntheticEvent } from 'react'

export interface IPropsVerticalScroll {
      scroll: number;
      ganttHeight: number;
      ganttFullHeight: number;
      headerHeight: number;
      rtl: boolean;
      onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
}
