import {Component, HostListener, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import * as moment from 'moment';
import {DeviceService} from '../../../../services/device.service';
import {Subscription} from 'rxjs/Subscription';
import {StaticData} from '../../../../utils/static-data';
import {Formatters} from '../../../../utils/Formatters';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-chart-history',
  templateUrl: './chart-history.component.html',
  styleUrls: ['./chart-history.component.css']
})
export class ChartHistoryComponent implements OnInit, OnDestroy, OnChanges {

  @Input() ChartPoints: Array<any>;
  @Input() DeviceType;

  arrayOfCriterias: Array<any>;
  lineChartData: Array<any>;
  fullPointInfo: object;
  isMobileSize: boolean;
  clientWidth: number;
  subscription: Subscription;
  point: any;
  options: Object;
  chart: any;

  constructor(private service: DeviceService, private translateService: TranslateService) {
    this.arrayOfCriterias = StaticData.Criterion;
    this.isMobileSize = false;
    this.clientWidth = document.body.clientWidth;
  }

  ngOnInit() {
    this.isMobileSize = document.body.clientWidth >= StaticData.MOBILE_CLIENT_WIDTH;
    this.subscription = this.service.fullPointInfo.subscribe(data => {

      const config = StaticData.GetDeviceTypeInfo(this.DeviceType).historyConfig;
      const d = data['data'];
      this.fullPointInfo = this.getFilteredInfo(d, config, this.isMobileSize ? 2 : 1);
    });
    this.chartInitialization();
  }

  getFilteredInfo(data, typeConfig, colsCount): any {
    const infos = [];
    let currentRow;
    for (let i = 0; i < typeConfig.length; i++) {
      const config = typeConfig[i];

      // check if needed to show current parameter
      if (config.showPredicate && !config.showPredicate(data)) {
        continue;
      }

      let value = data[config.param];
      if (Number(value)) {
        value = Math.round(value);
      }
      const valueStr = config.formatter ? config.formatter(value, this.translateService) : value;

      // separate params on rows
      if (!currentRow || (currentRow.length % colsCount === 0)) {
        currentRow = [];
        infos.push(currentRow);
      }

      currentRow.push({
        name: config.name,
        value: valueStr,
      });
    }
    return infos;
  }

  ngOnChanges() {
    this.chartInitialization();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobileSize = document.body.clientWidth >= StaticData.MOBILE_CLIENT_WIDTH;
  }

  chartInitialization() {
    this.options = {
      title: {text: ''},
      xAxis: {
        categories: [],
        labels: {
          step: Math.round(this.ChartPoints.length / 8),
          rotation: -75
        }
      },
      yAxis: {
        title: {
          text: null
        }
      },
      chart: {
        zoomType: 'x'
      },
      series: []
    };
    this.lineChartData = [];

    if (this.ChartPoints.length === 0) {
      return;
    }

    for (let i = 0; i < this.ChartPoints.length; i++) {
      this.options['xAxis'].categories.push(moment(this.ChartPoints[i].time).locale('ru').format('DD.MM.YYYY HH:mm'));
      for (let j = 0; j < this.ChartPoints[i]['data'].length; j++) {
        if (!this.lineChartData[j]) {
          this.lineChartData[j] = {data: [], label: ''};
        }
        const criterion = this.arrayOfCriterias.find(cri => cri['value'] === this.ChartPoints[i]['data'][j].parameter);
        if (criterion) {
          this.lineChartData[j].label = this.translateService.instant(criterion.name);
          this.lineChartData[j].data.push(this.ChartPoints[i]['data'][j].value);
        }
      }
    }
    for (let i = 0; i < this.lineChartData.length; i++) {
      this.options['series'].push({
        marker: {
          enabled: false
        },
        name: this.lineChartData[i].label,
        data: this.lineChartData[i].data,
        allowPointSelect: true
      });
    }

    const tranService = this.translateService;

    if (this.DeviceType === StaticData.PELLET_LEVEL) {
      this.options['yAxis'] = {
        reversed: true,
        title: {
          text: null
        },
        labels: {

          formatter() {
            const label = this.axis.defaultLabelFormatter.call(this);
            return Formatters.formatLevel(label, tranService);
          }
        }
      };

      this.options['tooltip'] = {
        formatter: function () {
          return Formatters.formatLevel(this['y'], tranService);
        }
      };
    }

    if (this.DeviceType === StaticData.BIO_UNIVERSAL) {
      const self = this;
      this.options['tooltip'] = {
        formatter: function () {
          let value = this.y;
          switch (this.series.name) {
            case self.translateService.instant('CRITERION.CRITERIA_8'):
              value = Formatters.formatError(this['y'], tranService);
              break;
            case self.translateService.instant('CRITERION.CRITERIA_7'):
              value = Formatters.formatAutomationState(this['y'], tranService);
              break;
          }
          return this.x + '<br/><span style="color:' + this.color + '">\u25CF</span> ' + this.series.name + ': ' + value;
        }
      };
    }
  }

  onPointSelect(e) {
    this.point = null;
    for (let i = 0; i < this.ChartPoints.length; i++) {
      if (moment(this.ChartPoints[i].time).locale('ru').format('DD.MM.YYYY HH:mm') === e.context.category) {
        this.service.getPointFullInfo(this.ChartPoints[i].deviceDataId);
        this.point = moment(this.ChartPoints[i].time).locale('ru').format('DD.MM.YYYY HH:mm');
      }
    }
  }
}
