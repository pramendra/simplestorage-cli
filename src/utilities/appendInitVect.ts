import { Transform, TransformOptions, TransformCallback } from 'stream';
import { SingleBar, MultiBar, Presets } from 'cli-progress';

export default class AppendInitVect extends Transform {
  protected appended: boolean;
  private transferred: number;
  protected bar: MultiBar;
  protected progress: SingleBar;

  constructor(
    protected initVect: Buffer,
    protected barLength: number,
    opts?: TransformOptions
  ) {
    super(opts);
    this.appended = false;

    this.bar = new MultiBar({
      clearOnComplete: false,
      hideCursor: false,
      format:
        '[{bar}] {percentage}% | {transferred}/{length} bytes | {filename}',
    });
    this.transferred = 0;
    this.progress = this.bar.create(100, 0, {
      // filename: filePath,
      transferred: 0,
      length: this.barLength,
    });
  }
  _construct(callback: (error?: Error | null) => void) {
    callback(null);
  }

  _transform(
    chunk: any,
    encoding: BufferEncoding,
    cb: TransformCallback
  ): void {
    if (!this.appended) {
      this.push(this.initVect);
      this.appended = true;
    }

    this.transferred += chunk.length;

    this.progress.update((this.transferred / this.barLength) * 100, {
      // filename: filePath,
      transferred: this.transferred,
      length: this.barLength,
    });

    this.push(chunk);
    cb();
  }

  _final(callback: (error?: Error | null) => void) {
    this.bar.stop();
    callback(null);
  }
}
