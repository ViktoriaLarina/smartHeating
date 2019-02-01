import {Component, Input, OnInit} from '@angular/core';
import {DeviceService} from '../../../../../services/device.service';
import {StaticData} from '../../../../../utils/static-data';
import {Language} from '../../../../../utils/language';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class WeatherChartComponent implements OnInit {

  HOURS_IN_DAY = 24;
  DEFAULT_TEMPERATURE = 40;

  private settings: any;

  @Input()
  set weeklySettings(val: any) {
    this.settings = val;
    this.refreshChart();
  }

  options: Object;
  isChartOn: boolean;

  constructor(private service: DeviceService) {
  }

  ngOnInit() {
  }

  refreshChart() {
    this.onWeeklySettingsChanged(this.service.showWeeklySettingsFlag);
    this.service.isShowWeekleySettings.subscribe((data) => this.onWeeklySettingsChanged(data));
  }

  onWeeklySettingsChanged(data) {
    this.isChartOn = data;
    if (!this.isChartOn) {
      return;
    }
    if (!this.settings.data || this.settings.data.length === 0) {

      this.settings.data = new Array(StaticData.HOURS_IN_DAY);
      this.settings.data.fill(StaticData.DEFAULT_TEMPERATURE);
    }
    this.setChartData();
  }

  setChartData() {
    this.options = {
      title: {
        text: false
      },
      legend: {
        enabled: false
      },
      chart: {
        height: 300,
        animation: false,
        type: 'line'
      },
      yAxis: {
        title: {
          text: Language.getTemperature()
        },
        min: 0,
        max: 90,
        tickInterval: 10,
        categories: [Language.getSwitchOff()]
      },
      tooltip: {
        formatter: function () {
          return Math.round(this.y);
        }
      },
      xAxis: {
        title: {
          text: Language.getTime()
        },
        min: 0,
        max: 23,
        tickInterval: 1
      },
      series: [{
        name: Language.getTemperature(),
        // step: true,
        type: 'spline',
        draggableY: true,
        dragMinY: 0,
        dragMaxY: 90,
        availableMinY: 40,
        data: this.settings.data.slice()
      }],
      plotOptions: {
        series: {
          point: {
            events: {
              drop: (point) => this.settings.data[point.x] = Math.round(point.y)
            }
          }
        }
      }
    };
  }

}
