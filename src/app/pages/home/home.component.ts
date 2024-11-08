import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartOptions, ChartType } from 'chart.js';
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
  
  public pieChartType: ChartType = 'pie';
  public pieChartLabels = [];
  public pieChartData: { data: number[] }[] = [
    { data: [] }
  ];
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartOptions: ChartOptions = {
    responsive: false,
    onClick: (event, elements) => {
      console.log(elements);
      
      // Vérifier si un segment a été cliqué
      if (elements.length > 0) {
        const chartElement = elements[0];
        const index = chartElement.index; // Index du segment cliqué
        this.onSegmentClick(index);
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Arial',
            size: 14,
            weight: 'bold'
          },
          color: '#333'
        }
      },
      tooltip: {
        backgroundColor: '#04838F',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: (tooltipItem) => {
            return `🏅${tooltipItem.raw}`;
          }
        }
      }
    }
  };
  public pieChartColors = [
    {
      backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#3357eF', '#3357Fe'], // Couleurs des segments
      // borderColor: '#ffffff',  // Couleur de la bordure
      // borderWidth: 2,          // Largeur de la bordure
      // // hoverBackgroundColor: ['#FF6F48', '#5FF678', '#4C8CFF'], // Couleurs au survol
      // hoverBorderColor: '#000000', // Couleur de la bordure au survol
      // hoverBorderWidth: 3        // Largeur de la bordure au survol
    }
  ];
  aze!: any
  

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    
    this.olympicService.loadInitialData().subscribe({

      complete: () => {

        this.olympics$ = this.olympicService.getOlympics();
        
        this.olympics$.subscribe((data) => {
        
          if(data) {
            
            this.aze = data
            
            data.forEach((countryInfo: OlympicCountry) => {

              const totalMedalsCount = countryInfo.participations.reduce((sum, event) => sum + event.medalsCount, 0);
              this.pieChartData[0].data.push(totalMedalsCount)

            });
             this.pieChartLabels = data.map((item: any) => item.country);
          } else {
            throw new Error('Datas not found!')
          }
        });
      }
    });
  }

  onSegmentClick(index: number) {
    const segmentId = this.aze[index].id;
    console.log(segmentId);
    
    this.router.navigate([`/country/${segmentId}`])
  }
}
