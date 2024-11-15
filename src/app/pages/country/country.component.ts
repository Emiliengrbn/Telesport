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
    labels: [],
    datasets: [{data: []}]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: false
      }
    }
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
        
        this.selectedCountry = this.foundCountry(this.olympics);
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
      this.athletesCount = this.selectedCountry?.participations.reduce((total, participation) => total + participation.athleteCount, 0);

      const labels = this.selectedCountry?.participations.map(participation => participation.year.toString()) || [];
      const data = this.selectedCountry?.participations.map(participation => participation.medalsCount) || [];

      labels.unshift('');
      labels.push('');

      data.unshift(NaN);
      data.push();

      this.lineChartData = {
        labels,
        datasets: [
          {
            data,
            label: 'Medals Count',
            fill: false,
            tension: 0,
            borderColor: '#04838F',
            backgroundColor: 'rgba(0,0,0,0)'
          }
        ]
      };
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
