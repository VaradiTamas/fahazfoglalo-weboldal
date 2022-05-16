export class SreenSize {
  public static sm = 576;
  public static md = 768;
  public static lg = 992;
  public static xl = 1200;
}

export function sleep(ms: number): Promise<void> {
  return new Promise( resolve => setTimeout(resolve, ms) );
}
