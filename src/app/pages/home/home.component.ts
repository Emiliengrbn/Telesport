import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { Observable, of } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<any> = of(null);

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels = [ [ 'Download', 'Sales' ], [ 'In', 'Store', 'Sales' ], 'Mail Sales' ];
  // public pieChartLabels = [ [ 'Download', 'Sales' ], [ 'In', 'Store', 'Sales' ], 'Mail Sales' ];
  public pieChartDatasets = [ {
    data: [ 300, 500, 100 ]
  } ];
  // public pieChartDatasets = [ {
  //   data: [ 300, 500, 100 ]
  // } ];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympicService.loadInitialData().subscribe({
      complete: () => {
        this.olympics$ = this.olympicService.getOlympics();
        this.olympics$.subscribe((data) => {
          if(data) {
            // this.setupChart(data)
            const participations = data.map((item: any) => item.participations);
            participations.forEach((participation: any[], index: number) => {
              console.log(participation, index);
              participation.reduce((total, participation) => {
                console.log(total);

                return total + participation.medalsCount;
              }, 0)

            });


             this.pieChartLabels = data.map((item: any) => item.country);
          }
        });
      }
    });
  }
}
