import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ChartConfiguration, ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { Observable, of, Subscription } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
  // public olympics$: Observable<any> = of(null);
  olympics: any = []
  public selectedCountry: OlympicCountry | null = null;
  public medalsCount!: any;
  public athletesCount!: any;
  private subscription: Subscription | null = null;
  
  

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July'
    ],
    datasets: [
      {
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
        label: 'Series A',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };
  public lineChartLegend = false;

  constructor(private olympicService: OlympicService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.loadOlympics()
  }

  async loadOlympics() {
    try {
      this.olympics = await this.olympicService.getOlympicsData();

      if (this.olympics) {
        console.log(this.olympics);
        
        this.selectedCountry = this.foundCountry(this.olympics);
        console.log(this.selectedCountry);
        
    this.chartData()
      }
    } catch (error) {
      console.error('Error loading olympics data', error);
    }
    
  }

  foundCountry(data: OlympicCountry[]): OlympicCountry | null {
    const countryId = Number(this.route.snapshot.params['id']);
    return data.find(country => country.id === countryId) || null;
  }

  chartData() {
      this.medalsCount = this.selectedCountry?.participations.reduce((total, participation) => total + participation.medalsCount, 0)
      console.log(this.medalsCount);
      this.athletesCount = this.selectedCountry?.participations.reduce((total, participation) => total + participation.athleteCount, 0);
      console.log(this.athletesCount);
  }

  backHome() {
    this.router.navigate([`/`])
  }

  // ngOnDestroy(): void {
  //   // this.selectedCountry = null;
  //   // if (this.olympics) {
  //   //   this.olympics = null
  //   // }
  //   console.log("Pays sélectionné réinitialisé à null");
  // }
}
