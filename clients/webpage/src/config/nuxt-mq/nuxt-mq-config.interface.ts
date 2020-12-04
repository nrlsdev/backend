export interface IMQConfiguration {
  defaultBreakpoint: string;
  breakpoints: IMQBreakpointsConfiguration;
}

export interface IMQBreakpointsConfiguration {
  sm: number;
  md: number;
  lg: number;
}
