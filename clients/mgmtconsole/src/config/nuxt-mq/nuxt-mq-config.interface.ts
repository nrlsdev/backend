export interface IMQBreakpointsConfiguration {
  sm: number;
  md: number;
  lg: number;
}

export interface IMQConfiguration {
  defaultBreakpoint: string;
  breakpoints: IMQBreakpointsConfiguration;
}
