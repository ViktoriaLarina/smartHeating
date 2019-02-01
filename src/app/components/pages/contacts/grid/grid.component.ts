import { AfterViewChecked, Component, ElementRef, HostListener, Input } from '@angular/core';
import {ISortListNumber} from '../../../../models/sortListNumberInterface.model';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements AfterViewChecked {
  @Input() gutter: number;
  @Input() width: number;

  private _hostElement: Element;

  constructor(private elementRef: ElementRef) {
    this._hostElement = this.elementRef.nativeElement;
  }

  ngAfterViewChecked() {
    this.refreshGrid();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.refreshGrid();
  }

  // calculates which column to put next item in
  getLowestColumnIndex(sortList: ISortListNumber[]) {
    let index = 0;
    let height;
    for (let i = 0; i < sortList.length; i++) {
      if (height === undefined || sortList[i] < height) {
        index = i;
        height = sortList[i];
      }
    }
    return index;
  }

  // calculates which column to put next item in
  getHighestColumnIndex(sortList: ISortListNumber[]) {
    let index = 0;
    let height;
    for (let i = 0; i < sortList.length; i++) {
      if (height === undefined || sortList[i] > height) {
        index = i;
        height = sortList[i];
      }
    }
    return index;
  }

  private refreshGrid() {
    const container = this._hostElement.children[0] as HTMLElement;
    const cells = container.children;

    // calculate needed columns count
    const colCount = Math.floor((container.parentElement.parentElement.clientWidth + this.gutter) / (this.width + this.gutter));

    // list with actual heights of columns
    const heightList = new Array(colCount);

    // init height list of zeros
    heightList.fill(0);

    for (let i = 0; i < cells.length; i++) {
      const el = cells[i] as HTMLElement;

      const index = this.getLowestColumnIndex(heightList);

      el.style.width = this.width + 'px';
      el.style.position = 'absolute';
      el.style.left = (this.width + this.gutter) * index + 'px';
      el.style.top = heightList[index] + 'px';
      heightList[index] += el.clientHeight + this.gutter;
    }

    // set container height
    const height = heightList[this.getHighestColumnIndex(heightList)] - this.gutter + 'px';
    container.style.height = height;

    container.style.width = (this.width * colCount) + (this.gutter * (colCount - 1)) + 'px';
  }
}
